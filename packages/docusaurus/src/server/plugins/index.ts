/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {generate} from '@docusaurus/utils';
import fs from 'fs-extra';
import importFresh from 'import-fresh';
import path from 'path';
import {
  LoadContext,
  Plugin,
  PluginConfig,
  PluginContentLoadedActions,
  RouteConfig,
} from '../types';

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
  const plugins: Plugin<any>[] = _.compact(
    pluginConfigs.map(pluginItem => {
      let pluginModuleImport;
      let pluginOptions = {};
      if (!pluginItem) {
        return null;
      }

      if (typeof pluginItem === 'string') {
        pluginModuleImport = pluginItem;
      } else if (Array.isArray(pluginItem)) {
        pluginModuleImport = pluginItem[0];
        pluginOptions = pluginItem[1] || {};
      }

      if (!pluginModuleImport) {
        return null;
      }

      // module is any valid module identifier - npm package or locally-resolved path.
      const pluginModule = importFresh(pluginModuleImport);
      return (pluginModule.default || pluginModule)(context, pluginOptions);
    }),
  );

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

  return {
    plugins,
    pluginsRouteConfigs,
  };
}
