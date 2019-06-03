/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import importFresh from 'import-fresh';
import path from 'path';
import {generate} from '@docusaurus/utils';
import {LoadContext} from '..';

export async function loadPlugins({
  pluginConfigs = [],
  context,
}: {
  pluginConfigs: any[];
  context: LoadContext;
}) {
  // 1. Plugin Lifecycle - Initialization/Constructor
  const plugins = pluginConfigs.map(({module, options}) => {
    // module is any valid module identifier - npm package or locally-resolved path.
    const plugin = importFresh(module);
    return plugin(context, options);
  });

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
  const pluginsRouteConfigs: any[] = [];

  await Promise.all(
    plugins.map(async (plugin, index) => {
      if (!plugin.contentLoaded) {
        return;
      }

      const pluginContentDir = path.join(
        context.generatedFilesDir,
        plugin.name,
      );
      const actions = {
        addRoute: config => pluginsRouteConfigs.push(config),
        createData: async (name, content) => {
          const modulePath = path.join(pluginContentDir, name);
          await fs.ensureDir(path.dirname(modulePath));
          await generate(pluginContentDir, name, content);
          return modulePath;
        },
      };

      const loadedContent = pluginsLoadedContent[index];
      await plugin.contentLoaded({
        content: loadedContent,
        actions,
      });
    }),
  );

  return {
    plugins,
    pluginsRouteConfigs,
  };
}
