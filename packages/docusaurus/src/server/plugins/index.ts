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
  AllContent,
  LoadContext,
  PluginConfig,
  PluginContentLoadedActions,
  RouteConfig,
} from '@docusaurus/types';
import initPlugins, {InitPlugin} from './init';
import chalk from 'chalk';
import {DEFAULT_PLUGIN_ID} from '../../constants';
import {chain} from 'lodash';

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
  type ContentLoadedPlugin = {plugin: InitPlugin; content: unknown};
  const contentLoadedPlugins: ContentLoadedPlugin[] = await Promise.all(
    plugins.map(async (plugin) => {
      const content = plugin.loadContent ? await plugin.loadContent() : null;
      return {plugin, content};
    }),
  );

  const allContent: AllContent = chain(contentLoadedPlugins)
    .groupBy((item) => item.plugin.name)
    .mapValues((nameItems) => {
      return chain(nameItems)
        .groupBy((item) => item.plugin.options.id ?? DEFAULT_PLUGIN_ID)
        .mapValues((idItems) => idItems[0].content)
        .value();
    })
    .value();

  // 3. Plugin Lifecycle - contentLoaded.
  const pluginsRouteConfigs: RouteConfig[] = [];

  const globalData = {};

  await Promise.all(
    contentLoadedPlugins.map(async ({plugin, content}) => {
      if (!plugin.contentLoaded) {
        return;
      }

      const pluginId = plugin.options.id ?? DEFAULT_PLUGIN_ID;

      // plugins data files are namespaced by pluginName/pluginId
      const dataDirRoot = path.join(context.generatedFilesDir, plugin.name);
      const dataDir = path.join(dataDirRoot, pluginId);

      const addRoute: PluginContentLoadedActions['addRoute'] = (config) =>
        pluginsRouteConfigs.push(config);

      const createData: PluginContentLoadedActions['createData'] = async (
        name,
        data,
      ) => {
        const modulePath = path.join(dataDir, name);
        await fs.ensureDir(path.dirname(modulePath));
        await generate(dataDir, name, data);
        return modulePath;
      };

      // the plugins global data are namespaced to avoid data conflicts:
      // - by plugin name
      // - by plugin id (allow using multiple instances of the same plugin)
      const setGlobalData: PluginContentLoadedActions['setGlobalData'] = (
        data,
      ) => {
        globalData[plugin.name] = globalData[plugin.name] ?? {};
        globalData[plugin.name][pluginId] = data;
      };

      const actions: PluginContentLoadedActions = {
        addRoute,
        createData,
        setGlobalData,
      };

      await plugin.contentLoaded({
        content,
        actions,
        allContent,
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

      // TODO remove this deprecated lifecycle soon
      // deprecated since alpha-60
      console.error(
        chalk.red(
          'plugin routesLoaded lifecycle is deprecated. If you think we should keep this lifecycle, please open a Github issue with your usecase',
        ),
      );

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
