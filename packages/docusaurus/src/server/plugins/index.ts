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
  AllContent,
  TranslationFiles,
  ThemeConfig,
  LoadedPlugin,
  InitializedPlugin,
} from '@docusaurus/types';
import initPlugins from './init';
import chalk from 'chalk';
import {DEFAULT_PLUGIN_ID} from '../../constants';
import {chain} from 'lodash';
import {localizePluginTranslationFile} from '../translations/translations';
import applyRouteTrailingSlash from './applyRouteTrailingSlash';

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
  plugins: LoadedPlugin[];
  pluginsRouteConfigs: RouteConfig[];
  globalData: unknown;
  themeConfigTranslated: ThemeConfig;
}> {
  // 1. Plugin Lifecycle - Initialization/Constructor.
  const plugins: InitializedPlugin[] = initPlugins({
    pluginConfigs,
    context,
  });

  // 2. Plugin Lifecycle - loadContent.
  // Currently plugins run lifecycle methods in parallel and are not order-dependent.
  // We could change this in future if there are plugins which need to
  // run in certain order or depend on others for data.
  const loadedPlugins: LoadedPlugin[] = await Promise.all(
    plugins.map(async (plugin) => {
      const content = plugin.loadContent ? await plugin.loadContent() : null;
      return {...plugin, content};
    }),
  );

  type ContentLoadedTranslatedPlugin = LoadedPlugin & {
    translationFiles: TranslationFiles;
  };
  const contentLoadedTranslatedPlugins: ContentLoadedTranslatedPlugin[] = await Promise.all(
    loadedPlugins.map(async (contentLoadedPlugin) => {
      const translationFiles =
        (await contentLoadedPlugin?.getTranslationFiles?.({
          content: contentLoadedPlugin.content,
        })) ?? [];
      const localizedTranslationFiles = await Promise.all(
        translationFiles.map((translationFile) =>
          localizePluginTranslationFile({
            locale: context.i18n.currentLocale,
            siteDir: context.siteDir,
            translationFile,
            plugin: contentLoadedPlugin,
          }),
        ),
      );
      return {
        ...contentLoadedPlugin,
        translationFiles: localizedTranslationFiles,
      };
    }),
  );

  const allContent: AllContent = chain(loadedPlugins)
    .groupBy((item) => item.name)
    .mapValues((nameItems) => {
      return chain(nameItems)
        .groupBy((item) => item.options.id ?? DEFAULT_PLUGIN_ID)
        .mapValues((idItems) => idItems[0].content)
        .value();
    })
    .value();

  // 3. Plugin Lifecycle - contentLoaded.
  const pluginsRouteConfigs: RouteConfig[] = [];

  const globalData = {};

  await Promise.all(
    contentLoadedTranslatedPlugins.map(
      async ({content, translationFiles, ...plugin}) => {
        if (!plugin.contentLoaded) {
          return;
        }

        const pluginId = plugin.options.id ?? DEFAULT_PLUGIN_ID;

        // plugins data files are namespaced by pluginName/pluginId
        const dataDirRoot = path.join(context.generatedFilesDir, plugin.name);
        const dataDir = path.join(dataDirRoot, pluginId);

        const addRoute: PluginContentLoadedActions['addRoute'] = (
          initialRouteConfig,
        ) => {
          // Trailing slash behavior is handled in a generic way for all plugins
          const finalRouteConfig = applyRouteTrailingSlash(initialRouteConfig, {
            trailingSlash: context.siteConfig.trailingSlash,
            baseUrl: context.siteConfig.baseUrl,
          });
          pluginsRouteConfigs.push(finalRouteConfig);
        };

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
  // Currently plugins run lifecycle methods in parallel and are not order-dependent.
  // We could change this in future if there are plugins which need to
  // run in certain order or depend on others for data.
  await Promise.all(
    contentLoadedTranslatedPlugins.map(async (plugin) => {
      if (!plugin.routesLoaded) {
        return null;
      }

      // TODO remove this deprecated lifecycle soon
      // deprecated since alpha-60
      // TODO, 1 user reported usage of this lifecycle! https://github.com/facebook/docusaurus/issues/3918
      console.error(
        chalk.red(
          'Plugin routesLoaded lifecycle is deprecated. If you think we should keep this lifecycle, please report here: https://github.com/facebook/docusaurus/issues/3918',
        ),
      );

      return plugin.routesLoaded(pluginsRouteConfigs);
    }),
  );

  // Sort the route config. This ensures that route with nested
  // routes are always placed last.
  sortConfig(pluginsRouteConfigs);

  // Apply each plugin one after the other to translate the theme config
  function translateThemeConfig(
    untranslatedThemeConfig: ThemeConfig,
  ): ThemeConfig {
    return contentLoadedTranslatedPlugins.reduce(
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
      untranslatedThemeConfig,
    );
  }

  return {
    plugins: loadedPlugins,
    pluginsRouteConfigs,
    globalData,
    themeConfigTranslated: translateThemeConfig(context.siteConfig.themeConfig),
  };
}
