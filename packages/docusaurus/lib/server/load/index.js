/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const {generate} = require('@docusaurus/utils');
const loadConfig = require('./config');
const loadEnv = require('./env');
const loadTheme = require('./theme');
const loadRoutes = require('./routes');
const loadPlugins = require('./plugins');
const constants = require('../../constants');

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

  const env = loadEnv({siteDir, siteConfig});
  await generate(
    generatedFilesDir,
    'env.js',
    `export default ${JSON.stringify(env, null, 2)};`,
  );

  // Process plugins.
  const pluginConfigs = siteConfig.plugins || [];
  const context = {env, siteDir, generatedFilesDir, siteConfig, cliOptions};
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
    env,
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
