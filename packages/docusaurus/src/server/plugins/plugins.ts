/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import logger from '@docusaurus/logger';
import {initPlugins} from './init';
import {createBootstrapPlugin, createMDXFallbackPlugin} from './synthetic';
import {localizePluginTranslationFile} from '../translations/translations';
import {sortRoutes} from './routeConfig';
import {PerfLogger} from '../../utils';
import {createPluginActionsUtils} from './actions';
import type {
  LoadContext,
  RouteConfig,
  AllContent,
  GlobalData,
  LoadedPlugin,
  InitializedPlugin,
} from '@docusaurus/types';
import type {PluginIdentifier} from '@docusaurus/types/src/plugin';

async function translatePlugin({
  plugin,
  context,
}: {
  plugin: LoadedPlugin;
  context: LoadContext;
}): Promise<LoadedPlugin> {
  const {content} = plugin;

  const rawTranslationFiles =
    (await plugin.getTranslationFiles?.({content: plugin.content})) ?? [];

  const translationFiles = await Promise.all(
    rawTranslationFiles.map((translationFile) =>
      localizePluginTranslationFile({
        localizationDir: context.localizationDir,
        translationFile,
        plugin,
      }),
    ),
  );

  const translatedContent =
    plugin.translateContent?.({content, translationFiles}) ?? content;

  const translatedThemeConfigSlice = plugin.translateThemeConfig?.({
    themeConfig: context.siteConfig.themeConfig,
    translationFiles,
  });

  // TODO dangerous legacy, need to be refactored!
  // Side-effect to merge theme config translations. A plugin should only
  // translate its own slice of theme config and should make no assumptions
  // about other plugins' keys, so this is safe to run in parallel.
  Object.assign(context.siteConfig.themeConfig, translatedThemeConfigSlice);
  return {...plugin, content: translatedContent};
}

async function executePluginLoadContent({
  plugin,
  context,
}: {
  plugin: InitializedPlugin;
  context: LoadContext;
}): Promise<LoadedPlugin> {
  return PerfLogger.async(
    `Plugin - loadContent - ${plugin.name}@${plugin.options.id}`,
    async () => {
      const content = await plugin.loadContent?.();
      const loadedPlugin: LoadedPlugin = {...plugin, content};
      return translatePlugin({plugin: loadedPlugin, context});
    },
  );
}

async function executePluginsLoadContent({
  plugins,
  context,
}: {
  plugins: InitializedPlugin[];
  context: LoadContext;
}) {
  return PerfLogger.async(`Plugins - loadContent`, () =>
    Promise.all(
      plugins.map((plugin) => executePluginLoadContent({plugin, context})),
    ),
  );
}

function aggregateAllContent(loadedPlugins: LoadedPlugin[]): AllContent {
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

async function executePluginContentLoaded({
  plugin,
  context,
}: {
  plugin: LoadedPlugin;
  context: LoadContext;
}): Promise<{routes: RouteConfig[]; globalData: unknown}> {
  return PerfLogger.async(
    `Plugins - contentLoaded - ${plugin.name}@${plugin.options.id}`,
    async () => {
      if (!plugin.contentLoaded) {
        return {routes: [], globalData: undefined};
      }
      const pluginActionsUtils = await createPluginActionsUtils({
        plugin,
        generatedFilesDir: context.generatedFilesDir,
        baseUrl: context.siteConfig.baseUrl,
        trailingSlash: context.siteConfig.trailingSlash,
      });
      await plugin.contentLoaded({
        content: plugin.content,
        actions: pluginActionsUtils.getActions(),
      });
      return {
        routes: pluginActionsUtils.getRoutes(),
        globalData: pluginActionsUtils.getGlobalData(),
      };
    },
  );
}

async function executePluginAllContentLoaded({
  plugin,
  context,
  allContent,
}: {
  plugin: LoadedPlugin;
  context: LoadContext;
  allContent: AllContent;
}): Promise<{routes: RouteConfig[]; globalData: unknown}> {
  return PerfLogger.async(
    `Plugins - allContentLoaded - ${plugin.name}@${plugin.options.id}`,
    async () => {
      if (!plugin.allContentLoaded) {
        return {routes: [], globalData: undefined};
      }
      const pluginActionsUtils = await createPluginActionsUtils({
        plugin,
        generatedFilesDir: context.generatedFilesDir,
        baseUrl: context.siteConfig.baseUrl,
        trailingSlash: context.siteConfig.trailingSlash,
      });
      await plugin.allContentLoaded({
        allContent,
        actions: pluginActionsUtils.getActions(),
      });
      return {
        routes: pluginActionsUtils.getRoutes(),
        globalData: pluginActionsUtils.getGlobalData(),
      };
    },
  );
}

async function executePluginsContentLoaded({
  plugins,
  context,
}: {
  plugins: LoadedPlugin[];
  context: LoadContext;
}): Promise<{routes: RouteConfig[]; globalData: GlobalData}> {
  return PerfLogger.async(`Plugins - contentLoaded`, async () => {
    const routes: RouteConfig[] = [];
    const globalData: GlobalData = {};

    await Promise.all(
      plugins.map(async (plugin) => {
        const {routes: pluginRoutes, globalData: pluginGlobalData} =
          await executePluginContentLoaded({
            plugin,
            context,
          });

        routes.push(...pluginRoutes);

        if (pluginGlobalData !== undefined) {
          globalData[plugin.name] ??= {};
          globalData[plugin.name]![plugin.options.id] = pluginGlobalData;
        }
      }),
    );

    // Sort the route config.
    // This ensures that route with sub routes are always placed last.
    sortRoutes(routes, context.siteConfig.baseUrl);

    return {routes, globalData};
  });
}

async function executePluginsAllContentLoaded({
  plugins,
  context,
}: {
  plugins: LoadedPlugin[];
  context: LoadContext;
}): Promise<{routes: RouteConfig[]; globalData: GlobalData}> {
  return PerfLogger.async(`Plugins - allContentLoaded`, async () => {
    const allContent = aggregateAllContent(plugins);

    const routes: RouteConfig[] = [];
    const globalData: GlobalData = {};

    await Promise.all(
      plugins.map(async (plugin) => {
        const {routes: pluginRoutes, globalData: pluginGlobalData} =
          await executePluginAllContentLoaded({
            plugin,
            context,
            allContent,
          });

        routes.push(...pluginRoutes);

        if (pluginGlobalData !== undefined) {
          globalData[plugin.name] ??= {};
          globalData[plugin.name]![plugin.options.id] = pluginGlobalData;
        }
      }),
    );

    // Sort the route config.
    // This ensures that route with sub routes are always placed last.
    sortRoutes(routes, context.siteConfig.baseUrl);

    return {routes, globalData};
  });
}

export type LoadPluginsResult = {
  plugins: LoadedPlugin[];
  routes: RouteConfig[];
  globalData: GlobalData;
};

type ContentLoadedResult = {routes: RouteConfig[]; globalData: GlobalData};

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

function mergeResults({
  contentLoadedResult,
  allContentLoadedResult,
}: {
  contentLoadedResult: ContentLoadedResult;
  allContentLoadedResult: ContentLoadedResult;
}): ContentLoadedResult {
  const routes = [
    ...contentLoadedResult.routes,
    ...allContentLoadedResult.routes,
  ];
  sortRoutes(routes);

  const globalData = mergeGlobalData(
    contentLoadedResult.globalData,
    allContentLoadedResult.globalData,
  );

  return {routes, globalData};
}

/**
 * Initializes the plugins and run their lifecycle functions.
 */
export async function loadPlugins(
  context: LoadContext,
): Promise<LoadPluginsResult> {
  return PerfLogger.async('Plugins - loadPlugins', async () => {
    const initializedPlugins: InitializedPlugin[] = await PerfLogger.async(
      'Plugins - initPlugins',
      () => initPlugins(context),
    );

    initializedPlugins.push(
      createBootstrapPlugin(context),
      createMDXFallbackPlugin(context),
    );

    const plugins = await executePluginsLoadContent({
      plugins: initializedPlugins,
      context,
    });

    const contentLoadedResult = await executePluginsContentLoaded({
      plugins,
      context,
    });

    const allContentLoadedResult = await executePluginsAllContentLoaded({
      plugins,
      context,
    });

    const {routes, globalData} = mergeResults({
      contentLoadedResult,
      allContentLoadedResult,
    });

    return {plugins, routes, globalData};
  });
}

export function getPluginByIdentifier({
  plugins,
  pluginIdentifier,
}: {
  pluginIdentifier: PluginIdentifier;
  plugins: LoadedPlugin[];
}): LoadedPlugin {
  const plugin = plugins.find(
    (p) =>
      p.name === pluginIdentifier.name && p.options.id === pluginIdentifier.id,
  );
  if (!plugin) {
    throw new Error(
      logger.interpolate`Plugin not found for identifier ${pluginIdentifier.name}@${pluginIdentifier.id}`,
    );
  }
  return plugin;
}

export async function reloadPlugin({
  pluginIdentifier,
  plugins: previousPlugins,
  context,
}: {
  pluginIdentifier: PluginIdentifier;
  plugins: LoadedPlugin[];
  context: LoadContext;
}): Promise<LoadPluginsResult> {
  return PerfLogger.async('Plugins - reloadPlugin', async () => {
    const plugin = getPluginByIdentifier({
      plugins: previousPlugins,
      pluginIdentifier,
    });

    const reloadedPlugin = await executePluginLoadContent({plugin, context});
    const plugins = previousPlugins.with(
      previousPlugins.indexOf(plugin),
      reloadedPlugin,
    );

    // TODO optimize this, we shouldn't need to re-run this lifecycle
    const contentLoadedResult = await executePluginsContentLoaded({
      plugins,
      context,
    });

    const allContentLoadedResult = await executePluginsAllContentLoaded({
      plugins,
      context,
    });

    const {routes, globalData} = mergeResults({
      contentLoadedResult,
      allContentLoadedResult,
    });

    return {plugins, routes, globalData};
  });
}
