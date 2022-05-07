/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {docuHash, generate} from '@docusaurus/utils';
import path from 'path';
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
import {initPlugins} from './init';
import {createBootstrapPlugin, createMDXFallbackPlugin} from './synthetic';
import _ from 'lodash';
import {localizePluginTranslationFile} from '../translations/translations';
import {applyRouteTrailingSlash, sortConfig} from './routeConfig';

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
  const plugins: InitializedPlugin[] = await initPlugins(context);

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
  const loadedPlugins: LoadedPlugin[] = await Promise.all(
    plugins.map(async (plugin) => {
      const content = await plugin.loadContent?.();
      const rawTranslationFiles =
        (await plugin?.getTranslationFiles?.({content})) ?? [];
      const translationFiles = await Promise.all(
        rawTranslationFiles.map((translationFile) =>
          localizePluginTranslationFile({
            locale: context.i18n.currentLocale,
            siteDir: context.siteDir,
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
    }),
  );

  const allContent: AllContent = _.chain(loadedPlugins)
    .groupBy((item) => item.name)
    .mapValues((nameItems) =>
      _.chain(nameItems)
        .groupBy((item) => item.options.id)
        .mapValues((idItems) => idItems[0]!.content)
        .value(),
    )
    .value();

  // 3. Plugin Lifecycle - contentLoaded.
  const pluginsRouteConfigs: RouteConfig[] = [];
  const globalData: GlobalData = {};

  await Promise.all(
    loadedPlugins.map(async ({content, ...plugin}) => {
      if (!plugin.contentLoaded) {
        return;
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
      const actions: PluginContentLoadedActions = {
        addRoute(initialRouteConfig) {
          // Trailing slash behavior is handled generically for all plugins
          const finalRouteConfig = applyRouteTrailingSlash(
            initialRouteConfig,
            context.siteConfig,
          );
          pluginsRouteConfigs.push({
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
          globalData[plugin.name] ??= {};
          globalData[plugin.name]![pluginId] = data;
        },
      };

      await plugin.contentLoaded({content, actions, allContent});
    }),
  );

  // Sort the route config. This ensures that route with nested
  // routes are always placed last.
  sortConfig(pluginsRouteConfigs, context.siteConfig.baseUrl);

  return {plugins: loadedPlugins, pluginsRouteConfigs, globalData};
}
