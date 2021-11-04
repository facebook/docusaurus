/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Sidebar, SidebarItemCategory} from './sidebars/types';
import {PluginContentLoadedActions, RouteConfig} from '@docusaurus/types';
import {collectSidebarCategories} from './sidebars/utils';
import {docuHash, normalizeUrl, createSlugger} from '@docusaurus/utils';
import {LoadedVersion} from './types';

const createSidebarRoutes = async ({
  sidebarName,
  sidebar,
  versionPath,
  actions,
}: {
  sidebarName: string;
  sidebar: Sidebar;
  versionPath: string;
  actions: PluginContentLoadedActions;
}): Promise<RouteConfig[]> => {
  const slugs = createSlugger();

  async function createCategoryRoute(
    category: SidebarItemCategory,
  ): Promise<RouteConfig | undefined> {
    if (true) {
      return undefined;
    }

    // TODO temporary

    const categorySlug = slugs.slug(category.label);

    const slug = normalizeUrl([
      versionPath,
      slugs.slug(`${sidebarName}/category/${categorySlug}`),
    ]);
    const propFileName = `${versionPath}-${sidebarName}-category-${categorySlug}`;

    const prop: any = category;

    const categoryProp = await actions.createData(
      `${docuHash(`category/${propFileName}`)}.json`,
      JSON.stringify(prop, null, 2),
    );
    return {
      path: slug,
      component: '@theme/DocCategory',
      exact: true,
      modules: {
        category: categoryProp,
      },
    };
  }

  const routes = await Promise.all(
    collectSidebarCategories(sidebar).map(createCategoryRoute),
  );

  return routes.filter(Boolean) as RouteConfig[];
};

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
