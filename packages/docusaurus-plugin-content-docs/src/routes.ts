/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Sidebar,
  SidebarItemCategory,
  SidebarItemCategoryLinkGeneratedIndex,
} from './sidebars/types';
import {PluginContentLoadedActions, RouteConfig} from '@docusaurus/types';
import {collectSidebarCategories} from './sidebars/utils';
import {docuHash, createSlugger} from '@docusaurus/utils';
import {DocMetadata, LoadedVersion} from './types';
import {PropCategoryGeneratedIndex} from '@docusaurus/plugin-content-docs-types';
import {toVersionMetadataProp} from './props';
import chalk from 'chalk';

async function createSidebarRoutes({
  sidebarName,
  sidebar,
  versionPath,
  actions,
}: {
  sidebarName: string;
  sidebar: Sidebar;
  versionPath: string;
  actions: PluginContentLoadedActions;
}): Promise<RouteConfig[]> {
  const slugs = createSlugger();

  async function createCategoryGeneratedIndexRoute(
    category: SidebarItemCategory,
    link: SidebarItemCategoryLinkGeneratedIndex,
  ): Promise<RouteConfig> {
    const propFileName = slugs.slug(
      `${versionPath}-${sidebarName}-category-${category.label}`,
    );

    const prop: PropCategoryGeneratedIndex = {
      label: category.label,
      slug: link.slug,
      permalink: link.permalink,
    };

    const propData = await actions.createData(
      `${docuHash(`category/${propFileName}`)}.json`,
      JSON.stringify(prop, null, 2),
    );

    return {
      path: link.permalink,
      component: '@theme/DocCategoryGeneratedIndex',
      exact: true,
      modules: {
        categoryIndex: propData,
      },
      // Same as doc, this sidebar route attribute permits to associate this subpage to the given sidebar
      ...(sidebarName && {sidebar: sidebarName}),
    };
  }

  async function createCategoryRoute(
    category: SidebarItemCategory,
  ): Promise<RouteConfig | undefined> {
    if (category.link?.type === 'generated-index') {
      return createCategoryGeneratedIndexRoute(category, category.link);
    }
    return undefined;
  }

  const routes = await Promise.all(
    collectSidebarCategories(sidebar).map(createCategoryRoute),
  );

  return routes.filter(Boolean) as RouteConfig[];
}

export async function createSidebarsRoutes({
  version,
  actions,
}: {
  version: LoadedVersion;
  actions: PluginContentLoadedActions;
}): Promise<RouteConfig[]> {
  return (
    await Promise.all(
      Object.entries(version.sidebars).map(([sidebarName, sidebar]) =>
        createSidebarRoutes({
          sidebarName,
          sidebar,
          versionPath: version.versionPath,
          actions,
        }),
      ),
    )
  ).flat();
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
  pluginId,
  aliasedSource,
}: {
  loadedVersion: LoadedVersion;
  actions: PluginContentLoadedActions;
  docLayoutComponent: string;
  docItemComponent: string;
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
        createSidebarsRoutes({version, actions}),
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
