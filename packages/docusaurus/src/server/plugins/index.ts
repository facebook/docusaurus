/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {generate} from '@docusaurus/utils';
import fs from 'fs-extra';
import path from 'path';
import {
  LoadContext,
  Plugin,
  PluginConfig,
  PluginContentLoadedActions,
  RouteConfig,
} from '@docusaurus/types';
import {initPlugins} from './init';

export function sortConfig(routeConfigs: RouteConfig[]) {
  // Sort the route config. This ensures that route with nested routes is always placed last
  routeConfigs.sort((a, b) => {
    if (a.routes && !b.routes) {
      return 1;
    }
    if (!a.routes && b.routes) {
      return -1;
    }
    // Higher priority get placed first
    if (a.priority || b.priority) {
      const priorityA = a.priority || 0;
      const priorityB = b.priority || 0;
      const score = priorityA > priorityB ? -1 : priorityB > priorityA ? 1 : 0;
      if (score !== 0) {
        return score;
      }
    }
    return a.path > b.path ? 1 : b.path > a.path ? -1 : 0;
  });
}

export async function loadPlugins({
  pluginConfigs,
  context,
}: {
  pluginConfigs: PluginConfig[];
  context: LoadContext;
}): Promise<{
  plugins: Plugin<any>[];
  pluginsRouteConfigs: RouteConfig[];
}> {
  // 1. Plugin Lifecycle - Initialization/Constructor
  const plugins: Plugin<any>[] = initPlugins({pluginConfigs, context});

  // 2. Plugin lifecycle - loadContent
  // Currently plugins run lifecycle in parallel and are not order-dependent. We could change
  // this in future if there are plugins which need to run in certain order or depend on
  // others for data.
  const pluginsLoadedContent = await Promise.all(
    plugins.map(async plugin => {
      if (!plugin.loadContent) {
        return null;
      }
      const content = await plugin.loadContent();
      return content;
    }),
  );

  // 3. Plugin lifecycle - contentLoaded
  const pluginsRouteConfigs: RouteConfig[] = [];

  await Promise.all(
    plugins.map(async (plugin, index) => {
      if (!plugin.contentLoaded) {
        return;
      }

      const pluginContentDir = path.join(
        context.generatedFilesDir,
        plugin.name,
      );

      const actions: PluginContentLoadedActions = {
        addRoute: config => pluginsRouteConfigs.push(config),
        createData: async (name, content) => {
          const modulePath = path.join(pluginContentDir, name);
          await fs.ensureDir(path.dirname(modulePath));
          await generate(pluginContentDir, name, content);
          return modulePath;
        },
      };

      await plugin.contentLoaded({
        content: pluginsLoadedContent[index],
        actions,
      });
    }),
  );

  // Sort the route config. This ensures that route with nested routes is always placed last
  sortConfig(pluginsRouteConfigs);

  return {
    plugins,
    pluginsRouteConfigs,
  };
}
