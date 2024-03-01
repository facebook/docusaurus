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

async function loadPlugin({
  plugin,
  context,
}: {
  plugin: InitializedPlugin;
  context: LoadContext;
}): Promise<LoadedPlugin> {
  const content = await PerfLogger.async(
    `Plugins - loadContent - ${plugin.name}@${plugin.options.id}`,
    () => plugin.loadContent?.(),
  );

  const rawTranslationFiles =
    (await plugin.getTranslationFiles?.({content})) ?? [];
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
  if (!plugin.contentLoaded) {
    return {routes: [], globalData: undefined};
  }
  PerfLogger.start(
    `Plugins - contentLoaded - ${plugin.name}@${plugin.options.id}`,
  );

  const pluginId = plugin.options.id;
  // Plugins data files are namespaced by pluginName/pluginId
  const dataDir = path.join(context.generatedFilesDir, plugin.name, pluginId);
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

  await plugin.contentLoaded({content: plugin.content, actions, allContent});
  PerfLogger.end(
    `Plugins - contentLoaded - ${plugin.name}@${plugin.options.id}`,
  );

  return {routes, globalData};
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
  PerfLogger.start(`Plugins - contentLoaded`);

  const allRoutes: RouteConfig[] = [];
  const allGlobalData: GlobalData = {};

  await Promise.all(
    plugins.map(async (plugin) => {
      const {routes, globalData} = await executePluginContentLoaded({
        plugin,
        context,
        allContent,
      });

      allRoutes.push(...routes);
      if (globalData !== undefined) {
        allGlobalData[plugin.name] ??= {};
        allGlobalData[plugin.name]![plugin.options.id] = globalData;
      }
    }),
  );
  PerfLogger.end(`Plugins - contentLoaded`);

  return {routes: allRoutes, globalData: allGlobalData};
}

/**
 * Initializes the plugins, runs `loadContent`, `translateContent`,
 * `contentLoaded`, and `translateThemeConfig`. Because `contentLoaded` is
 * side-effect-ful (it generates temp files), so is this function. This function
 * would also mutate `context.siteConfig.themeConfig` to translate it.
 */
export async function loadPlugins(context: LoadContext): Promise<{
  plugins: LoadedPlugin[];
  pluginsRouteConfigs: RouteConfig[];
  globalData: GlobalData;
}> {
  // 1. Plugin Lifecycle - Initialization/Constructor.
  PerfLogger.start('Plugins - initPlugins');
  const plugins: InitializedPlugin[] = await initPlugins(context);
  PerfLogger.end('Plugins - initPlugins');

  plugins.push(
    createBootstrapPlugin(context),
    createMDXFallbackPlugin(context),
  );

  // 2. Plugin Lifecycle - loadContent.
  // Currently plugins run lifecycle methods in parallel and are not
  // order-dependent. We could change this in future if there are plugins which
  // need to run in certain order or depend on others for data.
  // This would also translate theme config and content upfront, given the
  // translation files that the plugin declares.
  PerfLogger.start(`Plugins - loadContent`);
  const loadedPlugins: LoadedPlugin[] = await Promise.all(
    plugins.map((plugin) => loadPlugin({plugin, context})),
  );
  PerfLogger.end(`Plugins - loadContent`);

  const allContent = aggregateAllContent(loadedPlugins);

  // 3. Plugin Lifecycle - contentLoaded.
  const {routes, globalData} = await PerfLogger.async(
    'Plugins - contentLoaded',
    () =>
      executePluginsContentLoaded({
        plugins: loadedPlugins,
        context,
        allContent,
      }),
  );
  PerfLogger.end(`Plugins - contentLoaded`);

  // Sort the route config. This ensures that route with nested
  // routes are always placed last.
  sortRoutes(routes, context.siteConfig.baseUrl);

  return {plugins: loadedPlugins, pluginsRouteConfigs: routes, globalData};
}
