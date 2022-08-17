/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import logger from '@docusaurus/logger';
import {docuHash, createSlugger} from '@docusaurus/utils';
import {
  toTagDocListProp,
  toTagsListTagsProp,
  toVersionMetadataProp,
} from './props';
import {getVersionTags} from './tags';
import type {PluginContentLoadedActions, RouteConfig} from '@docusaurus/types';
import type {FullVersion, VersionTag} from './types';
import type {
  CategoryGeneratedIndexMetadata,
  PluginOptions,
  PropTagsListPage,
} from '@docusaurus/plugin-content-docs';

async function buildVersionCategoryGeneratedIndexRoutes({
  version,
  actions,
  options,
  aliasedSource,
}: BuildVersionRoutesParam): Promise<RouteConfig[]> {
  const slugs = createSlugger();

  async function buildCategoryGeneratedIndexRoute(
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
    version.categoryGeneratedIndices.map(buildCategoryGeneratedIndexRoute),
  );
}

async function createVersionDocRoutes({
  version,
  actions,
  options,
}: BuildVersionRoutesParam): Promise<RouteConfig[]> {
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

async function buildVersionTagsRoutes(
  param: BuildVersionRoutesParam,
): Promise<RouteConfig[]> {
  const {version, options, actions, aliasedSource} = param;
  const versionTags = getVersionTags(version.docs);

  async function buildTagsListRoute(): Promise<RouteConfig | null> {
    // Don't create a tags list page if there's no tag
    if (Object.keys(versionTags).length === 0) {
      return null;
    }
    const tagsProp: PropTagsListPage['tags'] = toTagsListTagsProp(versionTags);
    const tagsPropPath = await actions.createData(
      `${docuHash(`tags-list-${version.versionName}-prop`)}.json`,
      JSON.stringify(tagsProp, null, 2),
    );
    return {
      path: version.tagsPath,
      exact: true,
      component: options.docTagsListComponent,
      modules: {
        tags: aliasedSource(tagsPropPath),
      },
    };
  }

  async function buildTagDocListRoute(tag: VersionTag): Promise<RouteConfig> {
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
      component: options.docTagDocListComponent,
      exact: true,
      modules: {
        tag: aliasedSource(tagPropPath),
      },
    };
  }

  const [tagsListRoute, allTagsDocListRoutes] = await Promise.all([
    buildTagsListRoute(),
    Promise.all(Object.values(versionTags).map(buildTagDocListRoute)),
  ]);

  return _.compact([tagsListRoute, ...allTagsDocListRoutes]);
}

type BuildVersionRoutesParam = Omit<BuildAllRoutesParam, 'versions'> & {
  version: FullVersion;
};

async function buildVersionRoutes(
  param: BuildVersionRoutesParam,
): Promise<RouteConfig> {
  const {version, actions, options, aliasedSource} = param;

  async function createVersionSubRoutes() {
    const [docRoutes, categoryGeneratedIndexRoutes, tagsRoutes] =
      await Promise.all([
        createVersionDocRoutes(param),
        buildVersionCategoryGeneratedIndexRoutes(param),
        buildVersionTagsRoutes(param),
      ]);

    const routes = [
      ...docRoutes,
      ...categoryGeneratedIndexRoutes,
      ...tagsRoutes,
    ];
    return routes.sort((a, b) => a.path.localeCompare(b.path));
  }

  async function doBuildVersionRoutes(): Promise<RouteConfig> {
    const versionMetadata = toVersionMetadataProp(options.id, version);
    const versionMetadataPropPath = await actions.createData(
      `${docuHash(`version-${version.versionName}-metadata-prop`)}.json`,
      JSON.stringify(versionMetadata, null, 2),
    );
    return {
      path: version.path,
      // Allow matching /docs/* since this is the wrapping route
      exact: false,
      component: options.docLayoutComponent,
      routes: await createVersionSubRoutes(),
      modules: {
        versionMetadata: aliasedSource(versionMetadataPropPath),
      },
      priority: version.routePriority,
    };
  }

  try {
    return doBuildVersionRoutes();
  } catch (err) {
    logger.error`Can't create version routes for version name=${version.versionName}`;
    throw err;
  }
}

async function buildVersionsRoutes(
  param: BuildAllRoutesParam,
): Promise<RouteConfig[]> {
  return Promise.all(
    param.versions.map((version) =>
      buildVersionRoutes({
        ...param,
        version,
      }),
    ),
  );
}

type BuildAllRoutesParam = {
  versions: FullVersion[];
  options: PluginOptions;
  actions: Omit<PluginContentLoadedActions, 'addRoute' | 'setGlobalData'>;
  aliasedSource: (str: string) => string;
};

// TODO we want this build function to be easily testable
// Ideally, we should avoid side effects here (ie not injecting actions)
export async function buildAllRoutes(
  param: BuildAllRoutesParam,
): Promise<RouteConfig[]> {
  const versionRoutes = Promise.all(
    param.versions.map((version) =>
      buildVersionRoutes({
        ...param,
        version,
      }),
    ),
  );

  // TODO do we want to wrap all versions under a single parent component?
  // ie have a "root docs root" at the very top?
  // could be convenient to register a global docs plugin provider?

  return versionRoutes;
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
  const versionRoutes = await buildVersionsRoutes(param);
  versionRoutes.forEach((versionRoute) => param.actions.addRoute(versionRoute));
}
