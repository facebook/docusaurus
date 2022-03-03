/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {PluginContentLoadedActions, RouteConfig} from '@docusaurus/types';
import {docuHash, createSlugger} from '@docusaurus/utils';
import type {
  CategoryGeneratedIndexMetadata,
  LoadedVersion,
  VersionTag,
} from './types';
import type {
  PropCategoryGeneratedIndex,
  PropTagsListPage,
} from '@docusaurus/plugin-content-docs';
import {toVersionMetadataProp, toTagDocListProp} from './props';
import {getVersionTags} from './tags';
import logger from '@docusaurus/logger';

async function createCategoryGeneratedIndexRoutes({
  version,
  actions,
  docCategoryGeneratedIndexComponent,
  aliasedSource,
}: {
  version: LoadedVersion;
  actions: PluginContentLoadedActions;
  docCategoryGeneratedIndexComponent: string;
  aliasedSource: (str: string) => string;
}): Promise<RouteConfig[]> {
  const slugs = createSlugger();

  async function createCategoryGeneratedIndexRoute(
    categoryGeneratedIndex: CategoryGeneratedIndexMetadata,
  ): Promise<RouteConfig> {
    const {
      sidebar,
      title,
      description,
      slug,
      permalink,
      previous,
      next,
      image,
      keywords,
    } = categoryGeneratedIndex;

    const propFileName = slugs.slug(
      `${version.versionPath}-${categoryGeneratedIndex.sidebar}-category-${categoryGeneratedIndex.title}`,
    );

    const prop: PropCategoryGeneratedIndex = {
      title,
      description,
      slug,
      permalink,
      image,
      keywords,
      navigation: {
        previous,
        next,
      },
    };

    const propData = await actions.createData(
      `${docuHash(`category/${propFileName}`)}.json`,
      JSON.stringify(prop, null, 2),
    );

    return {
      path: permalink,
      component: docCategoryGeneratedIndexComponent,
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

async function createDocRoutes({
  version,
  actions,
  docItemComponent,
}: {
  version: LoadedVersion;
  actions: PluginContentLoadedActions;
  docItemComponent: string;
}): Promise<RouteConfig[]> {
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
        component: docItemComponent,
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

async function createTagsRoutes({
  version,
  actions,
  docTagsListComponent,
  docTagDocListComponent,
  aliasedSource,
}: {
  version: LoadedVersion;
  actions: PluginContentLoadedActions;
  docTagsListComponent: string;
  docTagDocListComponent: string;
  aliasedSource: (str: string) => string;
}): Promise<RouteConfig[]> {
  const tags = Object.values(getVersionTags(version.docs));

  async function createTagsListPage(): Promise<RouteConfig> {
    const tagsProp: PropTagsListPage['tags'] = tags.map((tagValue) => ({
      name: tagValue.name,
      permalink: tagValue.permalink,
      count: tagValue.docIds.length,
    }));

    const tagsPropPath = await actions.createData(
      `${docuHash(`tags-list-${version.versionName}-prop`)}.json`,
      JSON.stringify(tagsProp, null, 2),
    );
    return {
      path: version.tagsPath,
      exact: true,
      component: docTagsListComponent,
      modules: {
        tags: aliasedSource(tagsPropPath),
      },
    };
  }

  async function createTagDocListPage(tag: VersionTag): Promise<RouteConfig> {
    const tagProps = toTagDocListProp({
      allTagsPath: version.tagsPath,
      tag,
      docs: version.docs,
    });
    const tagPropPath = await actions.createData(
      `${docuHash(`tag-${tag.permalink}`)}.json`,
      JSON.stringify(tagProps, null, 2),
    );
    return {
      path: tag.permalink,
      component: docTagDocListComponent,
      exact: true,
      modules: {
        tag: aliasedSource(tagPropPath),
      },
    };
  }
  const tagsRoutes = tags.map(createTagDocListPage);
  // Only create /tags page if there are tags.
  if (tags.length > 0) {
    tagsRoutes.concat(createTagsListPage());
  }

  return Promise.all(tagsRoutes);
}

export async function createVersionRoutes({
  loadedVersion,
  actions,
  docItemComponent,
  docLayoutComponent,
  docCategoryGeneratedIndexComponent,
  docTagsListComponent,
  docTagDocListComponent,
  pluginId,
  aliasedSource,
}: {
  loadedVersion: LoadedVersion;
  actions: PluginContentLoadedActions;
  docLayoutComponent: string;
  docItemComponent: string;
  docCategoryGeneratedIndexComponent: string;
  docTagsListComponent: string;
  docTagDocListComponent: string;
  pluginId: string;
  aliasedSource: (str: string) => string;
}): Promise<void> {
  async function doCreateVersionRoutes(version: LoadedVersion): Promise<void> {
    const versionMetadata = toVersionMetadataProp(pluginId, version);
    const versionMetadataPropPath = await actions.createData(
      `${docuHash(`version-${version.versionName}-metadata-prop`)}.json`,
      JSON.stringify(versionMetadata, null, 2),
    );

    async function createVersionSubRoutes() {
      const [docRoutes, sidebarsRoutes, tagsRoutes] = await Promise.all([
        createDocRoutes({version, actions, docItemComponent}),
        createCategoryGeneratedIndexRoutes({
          version,
          actions,
          docCategoryGeneratedIndexComponent,
          aliasedSource,
        }),
        createTagsRoutes({
          version,
          actions,
          docTagsListComponent,
          docTagDocListComponent,
          aliasedSource,
        }),
      ]);

      const routes = [...docRoutes, ...sidebarsRoutes, ...tagsRoutes];
      return routes.sort((a, b) => a.path.localeCompare(b.path));
    }

    actions.addRoute({
      path: version.versionPath,
      // allow matching /docs/* as well
      exact: false,
      // main docs component (DocPage)
      component: docLayoutComponent,
      // sub-routes for each doc
      routes: await createVersionSubRoutes(),
      modules: {
        versionMetadata: aliasedSource(versionMetadataPropPath),
      },
      priority: version.routePriority,
    });
  }

  try {
    return await doCreateVersionRoutes(loadedVersion);
  } catch (err) {
    logger.error`Can't create version routes for version name=${loadedVersion.versionName}`;
    throw err;
  }
}
