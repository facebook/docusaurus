/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import _ from 'lodash';
import {docuHash, generate} from '@docusaurus/utils';
import {initPlugins} from './init';
import {createBootstrapPlugin, createMDXFallbackPlugin} from './synthetic';
import {localizePluginTranslationFile} from '../translations/translations';
import {applyRouteTrailingSlash, sortRoutes} from './routeConfig';
import {PerfLogger} from '../../utils';
import type {
  LoadContext,
  PluginContentLoadedActions,
  RouteConfig,
  AllContent,
  GlobalData,
  LoadedPlugin,
  InitializedPlugin,
  PluginRouteContext,
} from '@docusaurus/types';

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

// TODO refactor and make this side-effect-free
//  If the function was pure, we could more easily compare previous/next values
//  on site reloads, and bail-out of the reload process earlier
//  createData() modules should rather be declarative
async function executePluginContentLoaded({
  plugin,
  context,
  allContent,
}: {
  plugin: LoadedPlugin;
  context: LoadContext;
  allContent: AllContent;
}): Promise<{routes: RouteConfig[]; globalData: unknown}> {
  return PerfLogger.async(
    `Plugins - contentLoaded - ${plugin.name}@${plugin.options.id}`,
    async () => {
      if (!plugin.contentLoaded) {
        return {routes: [], globalData: undefined};
      }

      const pluginId = plugin.options.id;
      // Plugins data files are namespaced by pluginName/pluginId
      const dataDir = path.join(
        context.generatedFilesDir,
        plugin.name,
        pluginId,
      );
      const pluginRouteContextModulePath = path.join(
        dataDir,
        `${docuHash('pluginRouteContextModule')}.json`,
      );
      const pluginRouteContext: PluginRouteContext['plugin'] = {
        name: plugin.name,
        id: pluginId,
      };
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
          const finalRouteConfig = applyRouteTrailingSlash(
            initialRouteConfig,
            context.siteConfig,
          );
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

      await plugin.contentLoaded({
        content: plugin.content,
        actions,
        allContent,
      });

      return {routes, globalData};
    },
  );
}

async function executePluginsContentLoaded({
  plugins,
  context,
  allContent,
}: {
  plugins: LoadedPlugin[];
  context: LoadContext;
  // TODO AllContent was injected to this lifecycle for the debug plugin
  //  this was likely a bad idea and prevent to start executing contentLoaded()
  //  until all plugins have finished loading all the data
  //  we'd rather remove this and find another way to implement the debug plugin
  //  A possible solution: make it a core feature instead of a plugin?
  allContent: AllContent;
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

/**
 * Initializes the plugins, runs `loadContent`, `translateContent`,
 * `contentLoaded`, and `translateThemeConfig`. Because `contentLoaded` is
 * side-effect-ful (it generates temp files), so is this function. This function
 * would also mutate `context.siteConfig.themeConfig` to translate it.
 */
export async function loadPlugins(context: LoadContext): Promise<{
  plugins: LoadedPlugin[];
  routes: RouteConfig[];
  globalData: GlobalData;
}> {
  return PerfLogger.async('Plugins - loadPlugins', async () => {
    // 1. Plugin Lifecycle - Initialization/Constructor.
    const plugins: InitializedPlugin[] = await PerfLogger.async(
      'Plugins - initPlugins',
      () => initPlugins(context),
    );

    plugins.push(
      createBootstrapPlugin(context),
      createMDXFallbackPlugin(context),
    );

    // 2. Plugin Lifecycle - loadContent.
    const loadedPlugins = await executePluginsLoadContent({plugins, context});

    const allContent = aggregateAllContent(loadedPlugins);

    // 3. Plugin Lifecycle - contentLoaded.
    const {routes, globalData} = await executePluginsContentLoaded({
      plugins: loadedPlugins,
      context,
      allContent,
    });

    return {plugins: loadedPlugins, routes, globalData};
  });
}
