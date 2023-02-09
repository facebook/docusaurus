/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import {docuHash, createSlugger} from '@docusaurus/utils';
import {toVersionMetadataProp} from './props';
import type {PluginContentLoadedActions, RouteConfig} from '@docusaurus/types';
import type {FullVersion} from './types';
import type {
  CategoryGeneratedIndexMetadata,
  DocMetadata,
} from '@docusaurus/plugin-content-docs';

export async function createCategoryGeneratedIndexRoutes({
  version,
  actions,
  docCategoryGeneratedIndexComponent,
  aliasedSource,
}: {
  version: FullVersion;
  actions: PluginContentLoadedActions;
  docCategoryGeneratedIndexComponent: string;
  aliasedSource: (str: string) => string;
}): Promise<RouteConfig[]> {
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

export async function createDocRoutes({
  docs,
  actions,
  docItemComponent,
}: {
  docs: DocMetadata[];
  actions: PluginContentLoadedActions;
  docItemComponent: string;
}): Promise<RouteConfig[]> {
  return Promise.all(
    docs.map(async (metadataItem) => {
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

export async function createVersionRoutes({
  version,
  actions,
  docItemComponent,
  docLayoutComponent,
  docCategoryGeneratedIndexComponent,
  pluginId,
  aliasedSource,
}: {
  version: FullVersion;
  actions: PluginContentLoadedActions;
  docLayoutComponent: string;
  docItemComponent: string;
  docCategoryGeneratedIndexComponent: string;
  pluginId: string;
  aliasedSource: (str: string) => string;
}): Promise<void> {
  async function doCreateVersionRoutes(): Promise<void> {
    const versionMetadata = toVersionMetadataProp(pluginId, version);
    const versionMetadataPropPath = await actions.createData(
      `${docuHash(`version-${version.versionName}-metadata-prop`)}.json`,
      JSON.stringify(versionMetadata, null, 2),
    );

    async function createVersionSubRoutes() {
      const [docRoutes, sidebarsRoutes] = await Promise.all([
        createDocRoutes({docs: version.docs, actions, docItemComponent}),
        createCategoryGeneratedIndexRoutes({
          version,
          actions,
          docCategoryGeneratedIndexComponent,
          aliasedSource,
        }),
      ]);

      const routes = [...docRoutes, ...sidebarsRoutes];
      return routes.sort((a, b) => a.path.localeCompare(b.path));
    }

    actions.addRoute({
      path: version.path,
      // Allow matching /docs/* since this is the wrapping route
      exact: false,
      component: docLayoutComponent,
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
