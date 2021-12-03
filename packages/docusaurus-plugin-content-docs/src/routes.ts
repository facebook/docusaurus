/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginContentLoadedActions, RouteConfig} from '@docusaurus/types';
import {docuHash, createSlugger} from '@docusaurus/utils';
import {
  CategoryGeneratedIndexMetadata,
  DocMetadata,
  LoadedVersion,
} from './types';
import type {PropCategoryGeneratedIndex} from '@docusaurus/plugin-content-docs';
import {toVersionMetadataProp} from './props';
import chalk from 'chalk';

export async function createCategoryGeneratedIndexRoutes({
  version,
  actions,
  docCategoryGeneratedIndexComponent,
}: {
  version: LoadedVersion;
  actions: PluginContentLoadedActions;
  docCategoryGeneratedIndexComponent: string;
}): Promise<RouteConfig[]> {
  const slugs = createSlugger();

  async function createCategoryGeneratedIndexRoute(
    categoryGeneratedIndex: CategoryGeneratedIndexMetadata,
  ): Promise<RouteConfig> {
    const {sidebar, title, description, slug, permalink, previous, next} =
      categoryGeneratedIndex;

    const propFileName = slugs.slug(
      `${version.versionPath}-${categoryGeneratedIndex.sidebar}-category-${categoryGeneratedIndex.title}`,
    );

    const prop: PropCategoryGeneratedIndex = {
      title,
      description,
      slug,
      permalink,
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
        categoryGeneratedIndex: propData,
      },
      // Same as doc, this sidebar route attribute permits to associate this subpage to the given sidebar
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
        // This permits to render the sidebar once without unmount/remount when navigating (and preserve sidebar state)
        ...(metadataItem.sidebar && {
          sidebar: metadataItem.sidebar,
        }),
      };

      return docRoute;
    }),
  );
}

export async function createVersionRoutes({
  loadedVersion,
  actions,
  docItemComponent,
  docLayoutComponent,
  docCategoryGeneratedIndexComponent,
  pluginId,
  aliasedSource,
}: {
  loadedVersion: LoadedVersion;
  actions: PluginContentLoadedActions;
  docLayoutComponent: string;
  docItemComponent: string;
  docCategoryGeneratedIndexComponent: string;
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
      const [docRoutes, sidebarsRoutes] = await Promise.all([
        createDocRoutes({docs: version.docs, actions, docItemComponent}),
        createCategoryGeneratedIndexRoutes({
          version,
          actions,
          docCategoryGeneratedIndexComponent,
        }),
      ]);

      const routes = [...docRoutes, ...sidebarsRoutes];
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
  } catch (e) {
    console.error(
      chalk.red(
        `Can't create version routes for version "${loadedVersion.versionName}"`,
      ),
    );
    throw e;
  }
}
