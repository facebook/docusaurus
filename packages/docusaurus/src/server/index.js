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
  const {plugins: presetPlugins, themes: presetThemes} = loadPresets(context);

  // Process plugins and themes. Themes are also plugins, but they run after all
  // the explicit plugins because they may override the resolve.alias(es)
  // defined by the plugins.
  const pluginConfigs = [
    ...presetPlugins,
    ...(siteConfig.plugins || []),
    ...presetThemes,
    ...(siteConfig.themes || []),
  ];

  const {plugins, pluginsRouteConfigs} = await loadPlugins({
    pluginConfigs,
    context,
  });

  const outDir = path.resolve(siteDir, 'build');
  const {baseUrl} = siteConfig;

  // Default theme components that are essential and must exist in a Docusaurus app
  // These can be overriden in plugins/ through component swizzling.
  // However, we alias it here first as a fallback.
  const themeFallback = path.resolve(__dirname, '../client/theme-fallback');
  const fallbackAliases = await loadTheme(themeFallback);

  // Create theme alias from plugins.
  const pluginThemeAliases = await Promise.all(
    plugins.map(async plugin => {
      if (!plugin.getThemePath) {
        return null;
      }
      return loadTheme(plugin.getThemePath());
    }),
  );

  // User's own theme alias override. Highest priority.
  const themePath = path.resolve(siteDir, 'theme');
  const userAliases = await loadTheme(themePath);

  const combinedAliases = [
    fallbackAliases,
    ...pluginThemeAliases,
    userAliases,
  ].reduce(
    (acc, curr) => ({
      ...acc,
      ...curr,
    }),
    {},
  );

  // Make a fake plugin to resolve aliased theme components.
  plugins.push({
    configureWebpack: () => ({
      resolve: {
        alias: combinedAliases,
      },
    }),
  });

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
    baseUrl,
    generatedFilesDir,
    routesPaths,
    plugins,
    cliOptions,
  };

  return props;
};
