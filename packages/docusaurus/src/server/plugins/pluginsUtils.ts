/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import logger from '@docusaurus/logger';
import type {
  AllContent,
  GlobalData,
  InitializedPlugin,
  LoadedPlugin,
  PluginIdentifier,
  PluginRouteConfig,
  RouteConfig,
} from '@docusaurus/types';

export function getPluginByIdentifier<P extends InitializedPlugin>({
  plugins,
  pluginIdentifier,
}: {
  pluginIdentifier: PluginIdentifier;
  plugins: P[];
}): P {
  const plugin = plugins.find(
    (p) =>
      p.name === pluginIdentifier.name && p.options.id === pluginIdentifier.id,
  );
  if (!plugin) {
    throw new Error(
      logger.interpolate`Plugin not found for identifier ${formatPluginName(
        pluginIdentifier,
      )}`,
    );
  }
  return plugin;
}

export function aggregateAllContent(loadedPlugins: LoadedPlugin[]): AllContent {
  return _.chain(loadedPlugins)
    .groupBy((item) => item.name)
    .mapValues((nameItems) =>
      _.chain(nameItems)
        .groupBy((item) => item.options.id)
        .mapValues((idItems) => idItems[0]!.content)
        .value(),
    )
    .value();
}

export function toPluginRoute({
  plugin,
  route,
}: {
  plugin: LoadedPlugin;
  route: RouteConfig;
}): PluginRouteConfig {
  return {plugin: {name: plugin.name, id: plugin.options.id}, ...route};
}

export function aggregateRoutes(
  loadedPlugins: LoadedPlugin[],
): PluginRouteConfig[] {
  return loadedPlugins.flatMap((plugin) =>
    plugin.routes.map((route) => toPluginRoute({plugin, route})),
  );
}

export function aggregateGlobalData(loadedPlugins: LoadedPlugin[]): GlobalData {
  const globalData: GlobalData = {};
  loadedPlugins.forEach((plugin) => {
    if (plugin.globalData !== undefined) {
      globalData[plugin.name] ??= {};
      globalData[plugin.name]![plugin.options.id] = plugin.globalData;
    }
  });

  return globalData;
}

export function mergeGlobalData(...globalDataList: GlobalData[]): GlobalData {
  const result: GlobalData = {};

  const allPluginIdentifiers: PluginIdentifier[] = globalDataList.flatMap(
    (gd) =>
      Object.keys(gd).flatMap((name) =>
        Object.keys(gd[name]!).map((id) => ({name, id})),
      ),
  );

  allPluginIdentifiers.forEach(({name, id}) => {
    const allData = globalDataList
      .map((gd) => gd?.[name]?.[id])
      .filter((d) => typeof d !== 'undefined');
    const mergedData =
      allData.length === 1 ? allData[0] : Object.assign({}, ...allData);
    result[name] ??= {};
    result[name]![id] = mergedData;
  });

  return result;
}

// This is primarily useful for colored logging purpose
// Do not rely on this for logic
export function formatPluginName(
  plugin: InitializedPlugin | PluginIdentifier,
): string {
  let formattedName = plugin.name;
  // Hacky way to reduce string size for logging purpose
  formattedName = formattedName.replace('docusaurus-plugin-content-', '');
  formattedName = formattedName.replace('docusaurus-plugin-', '');
  formattedName = formattedName.replace('docusaurus-theme-', '');
  formattedName = formattedName.replace('-plugin', '');
  formattedName = logger.name(formattedName);

  const id = 'id' in plugin ? plugin.id : plugin.options.id;
  const formattedId = logger.subdue(id);

  return `${formattedName}@${formattedId}`;
}
