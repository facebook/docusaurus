/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {generate} from '@docusaurus/utils';
import fs from 'fs-extra';
import path from 'path';
import {
  LoadContext,
  PluginConfig,
  PluginContentLoadedActions,
  RouteConfig,
} from '@docusaurus/types';
import initPlugins, {InitPlugin} from './init';

const DefaultPluginId = 'default';

export function sortConfig(routeConfigs: RouteConfig[]): void {
  // Sort the route config. This ensures that route with nested
  // routes is always placed last.
  routeConfigs.sort((a, b) => {
    if (a.routes && !b.routes) {
      return 1;
    }
    if (!a.routes && b.routes) {
      return -1;
    }
    // Higher priority get placed first.
    if (a.priority || b.priority) {
      const priorityA = a.priority || 0;
      const priorityB = b.priority || 0;
      const score = priorityB - priorityA;

      if (score !== 0) {
        return score;
      }
    }

    return a.path.localeCompare(b.path);
  });

  routeConfigs.forEach((routeConfig) => {
    routeConfig.routes?.sort((a, b) => a.path.localeCompare(b.path));
  });
}

export async function loadPlugins({
  pluginConfigs,
  context,
}: {
  pluginConfigs: PluginConfig[];
  context: LoadContext;
}): Promise<{
  plugins: InitPlugin[];
  pluginsRouteConfigs: RouteConfig[];
  globalData: any;
}> {
  // 1. Plugin Lifecycle - Initialization/Constructor.
  const plugins: InitPlugin[] = initPlugins({
    pluginConfigs,
    context,
  });

  // 2. Plugin Lifecycle - loadContent.
  // Currently plugins run lifecycle methods in parallel and are not order-dependent.
  // We could change this in future if there are plugins which need to
  // run in certain order or depend on others for data.
  const pluginsLoadedContent = await Promise.all(
    plugins.map(async (plugin) => {
      if (!plugin.loadContent) {
        return null;
      }

      return plugin.loadContent();
    }),
  );

  // 3. Plugin Lifecycle - contentLoaded.
  const pluginsRouteConfigs: RouteConfig[] = [];

  const globalData = {};

  await Promise.all(
    plugins.map(async (plugin, index) => {
      if (!plugin.contentLoaded) {
        return;
      }

      const pluginContentDir = path.join(
        context.generatedFilesDir,
        plugin.name,
      );

      const addRoute: PluginContentLoadedActions['addRoute'] = (config) =>
        pluginsRouteConfigs.push(config);

      const createData: PluginContentLoadedActions['createData'] = async (
        name,
        content,
      ) => {
        const modulePath = path.join(pluginContentDir, name);
        await fs.ensureDir(path.dirname(modulePath));
        await generate(pluginContentDir, name, content);
        return modulePath;
      };

      // the plugins global data are namespaced to avoid data conflicts:
      // - by plugin name
      // - by plugin id (allow using multiple instances of the same plugin)
      const setGlobalData: PluginContentLoadedActions['setGlobalData'] = (
        data,
      ) => {
        const pluginId = plugin.id ?? DefaultPluginId;
        globalData[plugin.name] = globalData[plugin.name] ?? {};
        globalData[plugin.name][pluginId] = data;
      };

      const actions: PluginContentLoadedActions = {
        addRoute,
        createData,
        setGlobalData,
      };

      await plugin.contentLoaded({
        content: pluginsLoadedContent[index],
        actions,
      });
    }),
  );

  // 4. Plugin Lifecycle - routesLoaded.
  // Currently plugins run lifecycle methods in parallel and are not order-dependent.
  // We could change this in future if there are plugins which need to
  // run in certain order or depend on others for data.
  await Promise.all(
    plugins.map(async (plugin) => {
      if (!plugin.routesLoaded) {
        return null;
      }

      return plugin.routesLoaded(pluginsRouteConfigs);
    }),
  );

  // Sort the route config. This ensures that route with nested
  // routes are always placed last.
  sortConfig(pluginsRouteConfigs);

  return {
    plugins,
    pluginsRouteConfigs,
    globalData,
  };
}
