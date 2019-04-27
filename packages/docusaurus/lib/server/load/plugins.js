/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const path = require('path');
const {generate} = require('@docusaurus/utils');

module.exports = async function loadPlugins({pluginConfigs = [], context}) {
  // 1. Plugin Lifecycle - Initialization/Constructor
  const plugins = pluginConfigs.map(({name, path: pluginPath, options}) => {
    let Plugin;
    if (pluginPath && fs.existsSync(pluginPath)) {
      // eslint-disable-next-line
      Plugin = require(pluginPath);
    } else {
      try {
        // eslint-disable-next-line
        Plugin = require(name);
      } catch (ex) {
        throw new Error(`Error loading '${name}' plugin.`);
      }
    }
    return new Plugin(options, context);
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
  const pluginsRouteConfigs = [];

  await Promise.all(
    plugins.map(async (plugin, index) => {
      if (!plugin.contentLoaded) {
        return;
      }
      const pluginName = plugin.getName();
      const pluginContentDir = path.join(context.generatedFilesDir, pluginName);
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
    pluginsLoadedContent,
  };
};
