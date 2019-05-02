/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const {generate} = require('@docusaurus/utils');
const loadConfig = require('./load/config');
const loadTheme = require('./load/theme');
const loadRoutes = require('./load/routes');
const loadPlugins = require('./load/plugins');
const loadPresets = require('./load/presets');
const constants = require('../constants');

module.exports = async function load(siteDir, cliOptions = {}) {
  const generatedFilesDir = path.resolve(
    siteDir,
    constants.GENERATED_FILES_DIR_NAME,
  );

  const siteConfig = loadConfig(siteDir);
  await generate(
    generatedFilesDir,
    constants.CONFIG_FILE_NAME,
    `export default ${JSON.stringify(siteConfig, null, 2)};`,
  );

  const context = {siteDir, generatedFilesDir, siteConfig, cliOptions};

  // Process presets.
  const presetPlugins = loadPresets(context);

  // Process plugins.
  const pluginConfigs = [...presetPlugins, ...siteConfig.plugins];
  const {plugins, pluginsRouteConfigs} = await loadPlugins({
    pluginConfigs,
    context,
  });

  const outDir = path.resolve(siteDir, 'build');
  const {baseUrl} = siteConfig;

  // Resolve theme. TBD (Experimental)
  const themePath = loadTheme(siteDir);

  // Routing
  const {
    registry,
    routesChunkNames,
    routesConfig,
    routesPaths,
  } = await loadRoutes(pluginsRouteConfigs);

  await generate(
    generatedFilesDir,
    'registry.js',
    `export default {
${Object.keys(registry)
  .map(
    key => `  '${key}': {
    'importStatement': ${registry[key].importStatement},
    'module': '${registry[key].modulePath}',
    'webpack': require.resolveWeak('${registry[key].modulePath}'),
  },`,
  )
  .join('\n')}};\n`,
  );

  await generate(
    generatedFilesDir,
    'routesChunkNames.json',
    JSON.stringify(routesChunkNames, null, 2),
  );

  await generate(generatedFilesDir, 'routes.js', routesConfig);

  const props = {
    siteConfig,
    siteDir,
    outDir,
    themePath,
    baseUrl,
    generatedFilesDir,
    routesPaths,
    plugins,
    cliOptions,
  };

  return props;
};
