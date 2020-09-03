/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {generate, normalizeUrl, addTrailingSlash} from '@docusaurus/utils';
import path, {join} from 'path';
import ssrDefaultTemplate from '../client/templates/ssr.html.template';
import {
  BUILD_DIR_NAME,
  CONFIG_FILE_NAME,
  GENERATED_FILES_DIR_NAME,
  THEME_PATH,
} from '../constants';
import loadClientModules from './client-modules';
import loadConfig from './config';
import {loadPlugins} from './plugins';
import loadPresets from './presets';
import loadRoutes from './routes';
import loadThemeAlias from './themes';
import {
  DocusaurusConfig,
  DocusaurusSiteMetadata,
  LoadContext,
  LocalizationContext,
  PluginConfig,
  Props,
} from '@docusaurus/types';
import {loadHtmlTags} from './html-tags';
import {getPackageJsonVersion} from './versions';
import {handleDuplicateRoutes} from './duplicateRoutes';
import loadLocales from './loadLocales';

function addLocaleBaseUrlPathSegmentSuffix(
  originalPath: string,
  localization: LocalizationContext,
): string {
  if (localization.currentLocale === localization.defaultLocale) {
    return originalPath;
  } else {
    return addTrailingSlash(
      normalizeUrl([originalPath, localization.currentLocale]),
    );
  }
}

type LoadContextOptions = {customOutDir?: string; locale?: string};
import chalk from 'chalk';

export function loadContext(
  siteDir: string,
  {customOutDir, locale}: LoadContextOptions = {},
): LoadContext {
  const generatedFilesDir: string = path.resolve(
    siteDir,
    GENERATED_FILES_DIR_NAME,
  );
  const siteConfig: DocusaurusConfig = loadConfig(siteDir);
  const {ssrTemplate} = siteConfig;

  const baseOutDir = customOutDir
    ? path.resolve(customOutDir)
    : path.resolve(siteDir, BUILD_DIR_NAME);

  const locales = loadLocales(siteDir);

  const localization: LocalizationContext = {
    ...locales,
    currentLocale: locale ?? locales.defaultLocale,
  };

  const baseUrl = addLocaleBaseUrlPathSegmentSuffix(
    siteConfig.baseUrl,
    localization,
  );
  const outDir = addLocaleBaseUrlPathSegmentSuffix(baseOutDir, localization);

  console.log('baseUrl', baseUrl);
  console.log('outDir', outDir);

  return {
    siteDir,
    generatedFilesDir,
    siteConfig,
    outDir,
    baseUrl,
    localization,
    ssrTemplate,
  };
}

export function loadPluginConfigs(context: LoadContext): PluginConfig[] {
  const {plugins: presetPlugins, themes: presetThemes} = loadPresets(context);
  const {siteConfig} = context;
  return [
    ...presetPlugins,
    ...presetThemes,
    // Site config should be the highest priority.
    ...(siteConfig.plugins || []),
    ...(siteConfig.themes || []),
  ];
}

type LoadOptions = {
  customOutDir?: string;
  locale?: string;
};

export async function load(
  siteDir: string,
  {customOutDir, locale}: LoadOptions = {},
): Promise<Props> {
  // Context.
  const context: LoadContext = loadContext(siteDir, {customOutDir, locale});
  const {
    generatedFilesDir,
    siteConfig,
    outDir,
    baseUrl,
    localization,
    ssrTemplate,
  } = context;
  // Plugins.
  const pluginConfigs: PluginConfig[] = loadPluginConfigs(context);
  const {plugins, pluginsRouteConfigs, globalData} = await loadPlugins({
    pluginConfigs,
    context,
  });

  handleDuplicateRoutes(pluginsRouteConfigs, siteConfig.onDuplicateRoutes);

  // Site config must be generated after plugins
  // We want the generated config to have been normalized by the plugins!
  const genSiteConfig = generate(
    generatedFilesDir,
    CONFIG_FILE_NAME,
    `export default ${JSON.stringify(siteConfig, null, 2)};`,
  );

  // Themes.
  const fallbackTheme = path.resolve(__dirname, '../client/theme-fallback');
  const pluginThemes: string[] = plugins
    .map((plugin) => plugin.getThemePath && plugin.getThemePath())
    .filter((x): x is string => Boolean(x));
  const userTheme = path.resolve(siteDir, THEME_PATH);
  const alias = loadThemeAlias([fallbackTheme, ...pluginThemes], [userTheme]);

  // Make a fake plugin to:
  // - Resolve aliased theme components
  // - Inject scripts/stylesheets
  const {stylesheets = [], scripts = []} = siteConfig;
  plugins.push({
    name: 'docusaurus-bootstrap-plugin',
    options: {},
    version: {type: 'synthetic'},
    configureWebpack: () => ({
      resolve: {
        alias,
      },
    }),
    injectHtmlTags: () => {
      const stylesheetsTags = stylesheets.map((source) =>
        typeof source === 'string'
          ? `<link rel="stylesheet" href="${source}">`
          : {
              tagName: 'link',
              attributes: {
                rel: 'stylesheet',
                ...source,
              },
            },
      );
      const scriptsTags = scripts.map((source) =>
        typeof source === 'string'
          ? `<script type="text/javascript" src="${source}"></script>`
          : {
              tagName: 'script',
              attributes: {
                type: 'text/javascript',
                ...source,
              },
            },
      );
      return {
        headTags: [...stylesheetsTags, ...scriptsTags],
      };
    },
  });

  // Load client modules.
  const clientModules = loadClientModules(plugins);
  const genClientModules = generate(
    generatedFilesDir,
    'client-modules.js',
    `export default [\n${clientModules
      // import() is async so we use require() because client modules can have
      // CSS and the order matters for loading CSS.
      // We need to JSON.stringify so that if its on windows, backslash are escaped.
      .map((module) => `  require(${JSON.stringify(module)}),`)
      .join('\n')}\n];\n`,
  );

  // Load extra head & body html tags.
  const {headTags, preBodyTags, postBodyTags} = loadHtmlTags(plugins);

  // Routing.
  const {
    registry,
    routesChunkNames,
    routesConfig,
    routesPaths,
  } = await loadRoutes(pluginsRouteConfigs, baseUrl);

  const genRegistry = generate(
    generatedFilesDir,
    'registry.js',
    `export default {
${Object.keys(registry)
  .sort()
  .map(
    (key) =>
      // We need to JSON.stringify so that if its on windows, backslash are escaped.
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

  const genGlobalData = generate(
    generatedFilesDir,
    'globalData.json',
    JSON.stringify(globalData, null, 2),
  );

  // Version metadata.
  const siteMetadata: DocusaurusSiteMetadata = {
    docusaurusVersion: getPackageJsonVersion(
      join(__dirname, '../../package.json'),
    )!,
    siteVersion: getPackageJsonVersion(join(siteDir, 'package.json')),
    pluginVersions: {},
  };
  plugins
    .filter(({version: {type}}) => type !== 'synthetic')
    .forEach(({name, version}) => {
      siteMetadata.pluginVersions[name] = version;
    });
  checkDocusaurusPackagesVersion(siteMetadata);
  const genSiteMetadata = generate(
    generatedFilesDir,
    'site-metadata.json',
    JSON.stringify(siteMetadata, null, 2),
  );

  await Promise.all([
    genClientModules,
    genSiteConfig,
    genRegistry,
    genRoutesChunkNames,
    genRoutes,
    genGlobalData,
    genSiteMetadata,
  ]);

  const props: Props = {
    siteConfig,
    siteDir,
    outDir,
    baseUrl,
    localization,
    generatedFilesDir,
    routes: pluginsRouteConfigs,
    routesPaths,
    plugins,
    headTags,
    preBodyTags,
    postBodyTags,
    ssrTemplate: ssrTemplate || ssrDefaultTemplate,
  };

  return props;
}

// We want all @docusaurus/* packages  to have the exact same version!
// See https://github.com/facebook/docusaurus/issues/3371
// See https://github.com/facebook/docusaurus/pull/3386
function checkDocusaurusPackagesVersion(siteMetadata: DocusaurusSiteMetadata) {
  const {docusaurusVersion} = siteMetadata;
  Object.entries(siteMetadata.pluginVersions).forEach(
    ([plugin, versionInfo]) => {
      if (
        versionInfo.type === 'package' &&
        versionInfo.name?.startsWith('@docusaurus/') &&
        versionInfo.version !== docusaurusVersion
      ) {
        // should we throw instead?
        // It still could work with different versions
        console.warn(
          chalk.red(
            `Bad ${plugin} version ${versionInfo.version}.\nAll official @docusaurus/* packages should have the exact same version as @docusaurus/core (${docusaurusVersion}).\nMaybe you want to check, or regenerate your yarn.lock or package-lock.json file?`,
          ),
        );
      }
    },
  );
}
