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
      const name = plugin.getName();
      const {options} = plugin;
      const {metadataKey, metadataFileName} = options;
      const content = await plugin.loadContent();
      const pluginContentPath = path.join(name, metadataFileName);
      const pluginContentDir = path.join(context.generatedFilesDir, name);
      fs.ensureDirSync(pluginContentDir);
      await generate(
        pluginContentDir,
        metadataFileName,
        JSON.stringify(content, null, 2),
      );
      const contentPath = path.join('@generated', pluginContentPath);

      return {
        metadataKey,
        contentPath,
        content,
      };
    }),
  );

  // 3. Plugin lifecycle - contentLoaded
  const pluginsRouteConfigs = [];
  const actions = {
    addRoute: config => pluginsRouteConfigs.push(config),
  };

  await Promise.all(
    plugins.map(async (plugin, index) => {
      if (!plugin.contentLoaded) {
        return;
      }
      const loadedContent = pluginsLoadedContent[index];
      await plugin.contentLoaded({
        content: loadedContent.content,
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
