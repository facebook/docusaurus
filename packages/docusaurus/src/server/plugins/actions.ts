/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {docuHash, generate} from '@docusaurus/utils';
import {applyRouteTrailingSlash} from './routeConfig';
import type {
  InitializedPlugin,
  PluginContentLoadedActions,
  PluginRouteContext,
  RouteConfig,
} from '@docusaurus/types';

type PluginActionUtils = {
  getRoutes: () => RouteConfig[];
  getGlobalData: () => unknown;
  getActions: () => PluginContentLoadedActions;
};

// TODO refactor historical action system and make this side-effect-free
//  If the function were pure, we could more easily compare previous/next values
//  on site reloads, and bail-out of the reload process earlier
//  Particularly, createData() modules should rather be declarative
export async function createPluginActionsUtils({
  plugin,
  generatedFilesDir,
  baseUrl,
  trailingSlash,
}: {
  plugin: InitializedPlugin;
  generatedFilesDir: string;
  baseUrl: string;
  trailingSlash: boolean | undefined;
}): Promise<PluginActionUtils> {
  const pluginId = plugin.options.id;
  // Plugins data files are namespaced by pluginName/pluginId
  const dataDir = path.join(generatedFilesDir, plugin.name, pluginId);

  const pluginRouteContext: PluginRouteContext['plugin'] = {
    name: plugin.name,
    id: pluginId,
  };
  const pluginRouteContextModulePath = path.join(
    dataDir,
    `${docuHash('pluginRouteContextModule')}.json`,
  );
  // TODO not ideal place to generate that file
  await generate(
    '/',
    pluginRouteContextModulePath,
    JSON.stringify(pluginRouteContext, null, 2),
  );

  const routes: RouteConfig[] = [];
  let globalData: unknown;

  const actions: PluginContentLoadedActions = {
    addRoute(initialRouteConfig) {
      // Trailing slash behavior is handled generically for all plugins
      const finalRouteConfig = applyRouteTrailingSlash(initialRouteConfig, {
        baseUrl,
        trailingSlash,
      });
      routes.push({
        ...finalRouteConfig,
        context: {
          ...(finalRouteConfig.context && {data: finalRouteConfig.context}),
          plugin: pluginRouteContextModulePath,
        },
      });
    },
    async createData(name, data) {
      const modulePath = path.join(dataDir, name);
      await generate(dataDir, name, data);
      return modulePath;
    },
    setGlobalData(data) {
      globalData = data;
    },
  };

  return {
    // Some variables are mutable, so we expose a getter instead of the value
    getRoutes: () => routes,
    getGlobalData: () => globalData,
    getActions: () => actions,
  };
}
