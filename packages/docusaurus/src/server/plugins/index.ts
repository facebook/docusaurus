/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DocusaurusConfig} from '../config';
import {LoadContext} from '..';

import fs from 'fs-extra';
import importFresh from 'import-fresh';
import path from 'path';
import {generate} from '@docusaurus/utils';

export interface DocusaurusPlugin<T> {
  name: string;
  loadContent?(): T;
  contentLoaded?({
    content: T,
    actions: DocusaurusPluginContentLoadedActions,
  }): void;
  postBuild?(props: any): void;
  postStart?(props: any): void;
  configureWebpack?(config: DocusaurusConfig, isServer: boolean);
  getPathsToWatch?(): string[];
  getClientModules?(): string[];
}

export interface DocusaurusPluginConfig {
  module: string;
  options?: Object;
}

export interface DocusaurusPluginRouteConfig {
  path: string;
  component?: string;
  exact?: boolean;
  modules?: Object;
  routes?: DocusaurusPluginRouteConfig[];
}

export interface DocusaurusPluginContentLoadedActions {
  addRoute(config: DocusaurusPluginRouteConfig): void;
  createData(name: string, data: Object): Promise<string>;
}

export async function loadPlugins({
  pluginConfigs,
  context,
}: {
  pluginConfigs: DocusaurusPluginConfig[];
  context: LoadContext;
}): Promise<{
  plugins: DocusaurusPlugin<any>[];
  pluginsRouteConfigs: DocusaurusPluginRouteConfig[];
}> {
  // 1. Plugin Lifecycle - Initialization/Constructor
  const plugins: DocusaurusPlugin<any>[] = pluginConfigs.map(
    ({module, options}) => {
      // module is any valid module identifier - npm package or locally-resolved path.
      const plugin = importFresh(module);
      return plugin(context, options);
    },
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
  const pluginsRouteConfigs: DocusaurusPluginRouteConfig[] = [];

  await Promise.all(
    plugins.map(async (plugin, index) => {
      if (!plugin.contentLoaded) {
        return;
      }

      const pluginContentDir = path.join(
        context.generatedFilesDir,
        plugin.name,
      );

      const actions: DocusaurusPluginContentLoadedActions = {
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
