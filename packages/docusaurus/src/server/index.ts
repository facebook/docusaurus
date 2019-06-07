/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {generate} from '@docusaurus/utils';
import _ from 'lodash';
import path from 'path';
import {CONFIG_FILE_NAME, GENERATED_FILES_DIR_NAME} from '../constants';
import {loadClientModules} from './client-modules';
import {loadConfig} from './config';
import {loadPlugins} from './plugins';
import {loadPresets} from './presets';
import {loadRoutes} from './routes';
import {loadThemeAlias} from './themes';
import {
  CLIOptions,
  DocusaurusConfig,
  LoadContext,
  PluginConfig,
  Props,
} from './types';

export async function load(
  siteDir: string,
  cliOptions: CLIOptions = {},
): Promise<Props> {
  const generatedFilesDir: string = path.resolve(
    siteDir,
    GENERATED_FILES_DIR_NAME,
  );

  const siteConfig: DocusaurusConfig = loadConfig(siteDir);
  const genSiteConfig = generate(
    generatedFilesDir,
    CONFIG_FILE_NAME,
    `export default ${JSON.stringify(siteConfig, null, 2)};`,
  );

  const outDir = path.resolve(siteDir, 'build');
  const {baseUrl} = siteConfig;

  const context: LoadContext = {
    siteDir,
    generatedFilesDir,
    siteConfig,
    cliOptions,
    outDir,
    baseUrl,
  };

  // Presets.
  const {plugins: presetPlugins, themes: presetThemes} = loadPresets(context);

  // Plugins.
  const pluginConfigs: PluginConfig[] = [
    ...presetPlugins,
    ...presetThemes,
    // Site config should the highest priority.
    ...(siteConfig.plugins || []),
    ...(siteConfig.themes || []),
  ];
  const {plugins, pluginsRouteConfigs} = await loadPlugins({
    pluginConfigs,
    context,
  });

  // Themes.
  const fallbackTheme = path.resolve(__dirname, '../client/theme-fallback');
  const pluginThemes = _.compact(
    plugins.map(plugin => plugin.getThemePath && plugin.getThemePath()),
  );
  const userTheme = path.resolve(siteDir, 'theme');
  const alias = loadThemeAlias([fallbackTheme, ...pluginThemes, userTheme]);
  // Make a fake plugin to resolve aliased theme components.
  plugins.push({
    name: 'docusaurus-bootstrap-plugin',
    configureWebpack: () => ({
      resolve: {
        alias,
      },
    }),
  });

  // Load client modules.
  const clientModules = loadClientModules(plugins);
  const genClientModules = generate(
    generatedFilesDir,
    'client-modules.js',
    `export default [\n${clientModules
      // import() is async so we use require() because client modules can have
      // CSS and the order matters for loading CSS.
      .map(module => `  require(${JSON.stringify(module)}),`)
      .join('\n')}\n];\n`,
  );

  // Routing
  const {
    registry,
    routesChunkNames,
    routesConfig,
    routesPaths,
  } = await loadRoutes(pluginsRouteConfigs);

  const genRegistry = generate(
    generatedFilesDir,
    'registry.js',
    `export default {
${Object.keys(registry)
  .map(
    key => `  '${key}': {
    'importStatement': ${registry[key].importStatement},
    'module': ${JSON.stringify(registry[key].modulePath)},
    'webpack': require.resolveWeak(${JSON.stringify(registry[key].modulePath)}),
  },`,
  )
  .join('\n')}};\n`,
  );

  const genRoutesChunkNames = generate(
    generatedFilesDir,
    'routesChunkNames.json',
    JSON.stringify(routesChunkNames, null, 2),
  );

  const genRoutes = generate(generatedFilesDir, 'routes.js', routesConfig);

  await Promise.all([
    genClientModules,
    genSiteConfig,
    genRegistry,
    genRoutesChunkNames,
    genRoutes,
  ]);

  const props: Props = {
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
}
