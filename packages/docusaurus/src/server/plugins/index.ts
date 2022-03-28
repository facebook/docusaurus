/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {docuHash, generate} from '@docusaurus/utils';
import fs from 'fs-extra';
import path from 'path';
import type {
  LoadContext,
  PluginContentLoadedActions,
  RouteConfig,
  AllContent,
  GlobalData,
  ThemeConfig,
  LoadedPlugin,
  InitializedPlugin,
  PluginRouteContext,
} from '@docusaurus/types';
import {initPlugins} from './init';
import {createBootstrapPlugin, createMDXFallbackPlugin} from './synthetic';
import logger from '@docusaurus/logger';
import _ from 'lodash';
import {localizePluginTranslationFile} from '../translations/translations';
import {applyRouteTrailingSlash, sortConfig} from './routeConfig';

/**
 * Initializes the plugins, runs `loadContent`, `translateContent`,
 * `contentLoaded`, and `translateThemeConfig`.
 */
export async function loadPlugins(context: LoadContext): Promise<{
  plugins: LoadedPlugin[];
  pluginsRouteConfigs: RouteConfig[];
  globalData: GlobalData;
  themeConfigTranslated: ThemeConfig;
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
  const loadedPlugins: LoadedPlugin[] = await Promise.all(
    plugins.map(async (plugin) => {
      const content = await plugin.loadContent?.();
      return {...plugin, content};
    }),
  );

  const contentLoadedTranslatedPlugins = await Promise.all(
    loadedPlugins.map(async (plugin) => {
      const translationFiles =
        (await plugin?.getTranslationFiles?.({
          content: plugin.content,
        })) ?? [];
      const localizedTranslationFiles = await Promise.all(
        translationFiles.map((translationFile) =>
          localizePluginTranslationFile({
            locale: context.i18n.currentLocale,
            siteDir: context.siteDir,
            translationFile,
            plugin,
          }),
        ),
      );
      return {
        ...plugin,
        translationFiles: localizedTranslationFiles,
      };
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
    contentLoadedTranslatedPlugins.map(
      async ({content, translationFiles, ...plugin}) => {
        if (!plugin.contentLoaded) {
          return;
        }

        const pluginId = plugin.options.id;

        // plugins data files are namespaced by pluginName/pluginId
        const dataDirRoot = path.join(context.generatedFilesDir, plugin.name);
        const dataDir = path.join(dataDirRoot, pluginId);

        const createData: PluginContentLoadedActions['createData'] = async (
          name,
          data,
        ) => {
          const modulePath = path.join(dataDir, name);
          await fs.ensureDir(path.dirname(modulePath));
          await generate(dataDir, name, data);
          return modulePath;
        };

        // TODO this would be better to do all that in the codegen phase
        // TODO handle context for nested routes
        const pluginRouteContext: PluginRouteContext = {
          plugin: {name: plugin.name, id: pluginId},
          data: undefined, // TODO allow plugins to provide context data
        };
        const pluginRouteContextModulePath = await createData(
          `${docuHash('pluginRouteContextModule')}.json`,
          JSON.stringify(pluginRouteContext, null, 2),
        );

        const addRoute: PluginContentLoadedActions['addRoute'] = (
          initialRouteConfig,
        ) => {
          // Trailing slash behavior is handled in a generic way for all plugins
          const finalRouteConfig = applyRouteTrailingSlash(initialRouteConfig, {
            trailingSlash: context.siteConfig.trailingSlash,
            baseUrl: context.siteConfig.baseUrl,
          });
          pluginsRouteConfigs.push({
            ...finalRouteConfig,
            modules: {
              ...finalRouteConfig.modules,
              __routeContextModule: pluginRouteContextModulePath,
            },
          });
        };

        // the plugins global data are namespaced to avoid data conflicts:
        // - by plugin name
        // - by plugin id (allow using multiple instances of the same plugin)
        const setGlobalData: PluginContentLoadedActions['setGlobalData'] = (
          data,
        ) => {
          globalData[plugin.name] = globalData[plugin.name] ?? {};
          globalData[plugin.name]![pluginId] = data;
        };

        const actions: PluginContentLoadedActions = {
          addRoute,
          createData,
          setGlobalData,
        };

        const translatedContent =
          plugin.translateContent?.({content, translationFiles}) ?? content;

        await plugin.contentLoaded({
          content: translatedContent,
          actions,
          allContent,
        });
      },
    ),
  );

  // 4. Plugin Lifecycle - routesLoaded.
  await Promise.all(
    contentLoadedTranslatedPlugins.map(async (plugin) => {
      if (!plugin.routesLoaded) {
        return;
      }

      // TODO remove this deprecated lifecycle soon
      // deprecated since alpha-60
      // TODO, 1 user reported usage of this lifecycle! https://github.com/facebook/docusaurus/issues/3918
      logger.error`Plugin code=${'routesLoaded'} lifecycle is deprecated. If you think we should keep this lifecycle, please report here: url=${'https://github.com/facebook/docusaurus/issues/3918'}`;

      await plugin.routesLoaded(pluginsRouteConfigs);
    }),
  );

  // Sort the route config. This ensures that route with nested
  // routes are always placed last.
  sortConfig(pluginsRouteConfigs, context.siteConfig.baseUrl);

  // Apply each plugin one after the other to translate the theme config
  const themeConfigTranslated = contentLoadedTranslatedPlugins.reduce(
    (currentThemeConfig, plugin) => {
      const translatedThemeConfigSlice = plugin.translateThemeConfig?.({
        themeConfig: currentThemeConfig,
        translationFiles: plugin.translationFiles,
      });
      return {
        ...currentThemeConfig,
        ...translatedThemeConfigSlice,
      };
    },
    context.siteConfig.themeConfig,
  );

  return {
    plugins: loadedPlugins,
    pluginsRouteConfigs,
    globalData,
    themeConfigTranslated,
  };
}
