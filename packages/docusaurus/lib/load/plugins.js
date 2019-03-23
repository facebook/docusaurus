/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');

module.exports = async function loadPlugins({pluginConfigs = [], context}) {
  /* 1. Plugin Lifecycle - Initializiation/Constructor */
  const plugins = pluginConfigs.map(({name, path: pluginPath, options}) => {
    let Plugin;
    if (pluginPath && fs.existsSync(pluginPath)) {
      // eslint-disable-next-line
      Plugin = require(pluginPath);
    } else {
      try {
        // eslint-disable-next-line
        Plugin = require(name);
      } catch (e) {
        throw new Error(`'${name}' plugin cannot be found.`);
      }
    }
    return new Plugin(options, context);
  });

  // Do not allow plugin with duplicate name
  const pluginNames = new Set();
  plugins.forEach(plugin => {
    const name = plugin.getName();
    if (pluginNames.has(name)) {
      throw new Error(`Duplicate plugin with name '${name}' found`);
    }
    pluginNames.add(name);
  });

  /* 2. Plugin lifecycle - LoadContent */
  const pluginsLoadedContent = {};
  await Promise.all(
    plugins.map(async plugin => {
      if (!plugin.loadContent) {
        return;
      }
      const name = plugin.getName();
      pluginsLoadedContent[name] = await plugin.loadContent();
    }),
  );

  /* 3. Plugin lifecycle - contentLoaded */
  const pluginRouteConfigs = [];
  const actions = {
    addRoute: config => pluginRouteConfigs.push(config),
  };

  await Promise.all(
    plugins.map(async plugin => {
      if (!plugin.contentLoaded) {
        return;
      }
      const name = plugin.getName();
      const content = pluginsLoadedContent[name];
      await plugin.contentLoaded({content, actions});
    }),
  );
  return {
    plugins,
    pluginRouteConfigs,
  };
};
