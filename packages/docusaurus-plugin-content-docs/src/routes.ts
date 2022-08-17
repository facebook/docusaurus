/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import {docuHash, createSlugger} from '@docusaurus/utils';
import {toTagDocListProp, toVersionMetadataProp} from './props';
import {getVersionTags} from './tags';
import type {PluginContentLoadedActions, RouteConfig} from '@docusaurus/types';
import type {FullVersion, VersionTag} from './types';
import type {
  CategoryGeneratedIndexMetadata,
  PluginOptions,
  PropTagsListPage,
} from '@docusaurus/plugin-content-docs';

async function createVersionCategoryGeneratedIndexRoutes({
  version,
  actions,
  options,
  aliasedSource,
}: CreateVersionRoutesParam): Promise<RouteConfig[]> {
  const slugs = createSlugger();

  async function createCategoryGeneratedIndexRoute(
    categoryGeneratedIndex: CategoryGeneratedIndexMetadata,
  ): Promise<RouteConfig> {
    const {sidebar, ...prop} = categoryGeneratedIndex;

    const propFileName = slugs.slug(
      `${version.path}-${categoryGeneratedIndex.sidebar}-category-${categoryGeneratedIndex.title}`,
    );

    const propData = await actions.createData(
      `${docuHash(`category/${propFileName}`)}.json`,
      JSON.stringify(prop, null, 2),
    );

    return {
      path: categoryGeneratedIndex.permalink,
      component: options.docCategoryGeneratedIndexComponent,
      exact: true,
      modules: {
        categoryGeneratedIndex: aliasedSource(propData),
      },
      // Same as doc, this sidebar route attribute permits to associate this
      // subpage to the given sidebar
      ...(sidebar && {sidebar}),
    };
  }

  return Promise.all(
    version.categoryGeneratedIndices.map(createCategoryGeneratedIndexRoute),
  );
}

async function createVersionDocRoutes({
  version,
  actions,
  options,
}: CreateVersionRoutesParam): Promise<RouteConfig[]> {
  return Promise.all(
    version.docs.map(async (metadataItem) => {
      await actions.createData(
        // Note that this created data path must be in sync with
        // metadataPath provided to mdx-loader.
        `${docuHash(metadataItem.source)}.json`,
        JSON.stringify(metadataItem, null, 2),
      );

      const docRoute: RouteConfig = {
        path: metadataItem.permalink,
        component: options.docItemComponent,
        exact: true,
        modules: {
          content: metadataItem.source,
        },
        // Because the parent (DocPage) comp need to access it easily
        // This permits to render the sidebar once without unmount/remount when
        // navigating (and preserve sidebar state)
        ...(metadataItem.sidebar && {
          sidebar: metadataItem.sidebar,
        }),
      };

      return docRoute;
    }),
  );
}

type CreateVersionRoutesParam = Omit<CreateAllRoutesParam, 'versions'> & {
  version: FullVersion;
};

async function createVersionRoutes(
  param: CreateVersionRoutesParam,
): Promise<void> {
  const {version, actions, options, aliasedSource} = param;
  async function doCreateVersionRoutes(): Promise<void> {
    const versionMetadata = toVersionMetadataProp(options.id, version);
    const versionMetadataPropPath = await actions.createData(
      `${docuHash(`version-${version.versionName}-metadata-prop`)}.json`,
      JSON.stringify(versionMetadata, null, 2),
    );

    async function createVersionSubRoutes() {
      const [docRoutes, sidebarsRoutes] = await Promise.all([
        createVersionDocRoutes(param),
        createVersionCategoryGeneratedIndexRoutes(param),
      ]);

      const routes = [...docRoutes, ...sidebarsRoutes];
      return routes.sort((a, b) => a.path.localeCompare(b.path));
    }

    actions.addRoute({
      path: version.path,
      // Allow matching /docs/* since this is the wrapping route
      exact: false,
      component: options.docLayoutComponent,
      routes: await createVersionSubRoutes(),
      modules: {
        versionMetadata: aliasedSource(versionMetadataPropPath),
      },
      priority: version.routePriority,
    });
  }

  try {
    return await doCreateVersionRoutes();
  } catch (err) {
    logger.error`Can't create version routes for version name=${version.versionName}`;
    throw err;
  }
}

async function createVersionsRoutes(param: CreateAllRoutesParam) {
  await Promise.all(
    param.versions.map((version) =>
      createVersionRoutes({
        ...param,
        version,
      }),
    ),
  );
}

type CreateAllRoutesParam = {
  versions: FullVersion[];
  options: PluginOptions;
  actions: PluginContentLoadedActions;
  aliasedSource: (str: string) => string;
};

export async function createAllRoutes(
  param: CreateAllRoutesParam,
): Promise<void> {
  const {versions, options, actions, aliasedSource} = param;
  const {addRoute, createData} = actions;

  async function createVersionTagsRoutes(version: FullVersion) {
    const versionTags = getVersionTags(version.docs);

    // TODO tags should be a sub route of the version route
    async function createTagsListPage() {
      const tagsProp: PropTagsListPage['tags'] = Object.values(versionTags).map(
        (tagValue) => ({
          label: tagValue.label,
          permalink: tagValue.permalink,
          count: tagValue.docIds.length,
        }),
      );

      // Only create /tags page if there are tags.
      if (tagsProp.length > 0) {
        const tagsPropPath = await createData(
          `${docuHash(`tags-list-${version.versionName}-prop`)}.json`,
          JSON.stringify(tagsProp, null, 2),
        );
        addRoute({
          path: version.tagsPath,
          exact: true,
          component: options.docTagsListComponent,
          modules: {
            tags: aliasedSource(tagsPropPath),
          },
        });
      }
    }

    // TODO tags should be a sub route of the version route
    async function createTagDocListPage(tag: VersionTag) {
      const tagProps = toTagDocListProp({
        allTagsPath: version.tagsPath,
        tag,
        docs: version.docs,
      });
      const tagPropPath = await createData(
        `${docuHash(`tag-${tag.permalink}`)}.json`,
        JSON.stringify(tagProps, null, 2),
      );
      addRoute({
        path: tag.permalink,
        component: options.docTagDocListComponent,
        exact: true,
        modules: {
          tag: aliasedSource(tagPropPath),
        },
      });
    }

    await createTagsListPage();
    await Promise.all(Object.values(versionTags).map(createTagDocListPage));
  }

  await createVersionsRoutes(param);

  // TODO tags should be a sub route of the version route
  await Promise.all(versions.map(createVersionTagsRoutes));
}
