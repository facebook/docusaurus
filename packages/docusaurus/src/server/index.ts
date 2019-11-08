/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {generate} from '@docusaurus/utils';
import _ from 'lodash';
import path from 'path';
import {
  BUILD_DIR_NAME,
  CONFIG_FILE_NAME,
  GENERATED_FILES_DIR_NAME,
  THEME_PATH,
} from '../constants';
import {loadClientModules} from './client-modules';
import {loadConfig} from './config';
import {loadPlugins} from './plugins';
import {loadPresets} from './presets';
import {loadRoutes} from './routes';
import {loadThemeAlias} from './themes';
import {
  DocusaurusConfig,
  LoadContext,
  PluginConfig,
  Props,
} from '@docusaurus/types';

export function loadContext(siteDir: string): LoadContext {
  const generatedFilesDir: string = path.resolve(
    siteDir,
    GENERATED_FILES_DIR_NAME,
  );
  const siteConfig: DocusaurusConfig = loadConfig(siteDir);
  const outDir = path.resolve(siteDir, BUILD_DIR_NAME);
  const {baseUrl} = siteConfig;

  return {
    siteDir,
    generatedFilesDir,
    siteConfig,
    outDir,
    baseUrl,
  };
}

export function loadPluginConfigs(context: LoadContext): PluginConfig[] {
  const {plugins: presetPlugins, themes: presetThemes} = loadPresets(context);
  const {siteConfig} = context;
  return [
    ...presetPlugins,
    ...presetThemes,
    // Site config should the highest priority.
    ...(siteConfig.plugins || []),
    ...(siteConfig.themes || []),
  ];
}

export async function load(siteDir: string): Promise<Props> {
  // Context
  const context: LoadContext = loadContext(siteDir);
  const {generatedFilesDir, siteConfig, outDir, baseUrl} = context;
  const genSiteConfig = generate(
    generatedFilesDir,
    CONFIG_FILE_NAME,
    `export default ${JSON.stringify(siteConfig, null, 2)};`,
  );

  // Plugins
  const pluginConfigs: PluginConfig[] = loadPluginConfigs(context);
  const {plugins, pluginsRouteConfigs} = await loadPlugins({
    pluginConfigs,
    context,
  });

  // Themes.
  const fallbackTheme = path.resolve(__dirname, '../client/theme-fallback');
  const pluginThemes = _.compact(
    plugins.map(plugin => plugin.getThemePath && plugin.getThemePath()),
  );
  const userTheme = path.resolve(siteDir, THEME_PATH);
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
  .sort()
  .map(
    key =>
      `  '${key}': [${registry[key].loader}, ${JSON.stringify(
        registry[key].modulePath,
      )}, require.resolveWeak(${JSON.stringify(registry[key].modulePath)})],`,
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
  };

  return props;
}
