/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {generate} from '@docusaurus/utils';
import path, {join} from 'path';
import chalk from 'chalk';
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
  PluginConfig,
  Props,
} from '@docusaurus/types';
import {loadHtmlTags} from './html-tags';
import {getPackageJsonVersion} from './versions';
import {handleDuplicateRoutes} from './duplicateRoutes';
import {loadI18n, localizePath} from './i18n';
import {readCodeTranslationFileContent} from './translations/translations';
import {mapValues} from 'lodash';

type LoadContextOptions = {
  customOutDir?: string;
  locale?: string;
  localizePath?: boolean; // undefined = only non-default locales paths are localized
};

export async function loadContext(
  siteDir: string,
  options: LoadContextOptions = {},
): Promise<LoadContext> {
  const {customOutDir, locale} = options;
  const generatedFilesDir: string = path.resolve(
    siteDir,
    GENERATED_FILES_DIR_NAME,
  );
  const initialSiteConfig: DocusaurusConfig = loadConfig(siteDir);
  const {ssrTemplate} = initialSiteConfig;

  const baseOutDir = customOutDir
    ? path.resolve(customOutDir)
    : path.resolve(siteDir, BUILD_DIR_NAME);

  const i18n = await loadI18n(initialSiteConfig, {locale});

  const baseUrl = localizePath({
    path: initialSiteConfig.baseUrl,
    i18n,
    options,
    pathType: 'url',
  });
  const outDir = localizePath({
    path: baseOutDir,
    i18n,
    options,
    pathType: 'fs',
  });

  const siteConfig: DocusaurusConfig = {...initialSiteConfig, baseUrl};

  const codeTranslationFileContent =
    (await readCodeTranslationFileContent({
      siteDir,
      locale: i18n.currentLocale,
    })) ?? {};

  // We only need key->message for code translations
  const codeTranslations = mapValues(
    codeTranslationFileContent,
    (value) => value.message,
  );

  return {
    siteDir,
    generatedFilesDir,
    siteConfig,
    outDir,
    baseUrl,
    i18n,
    ssrTemplate,
    codeTranslations,
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

export async function load(
  siteDir: string,
  options: LoadContextOptions = {},
): Promise<Props> {
  // Context.
  const context: LoadContext = await loadContext(siteDir, options);
  const {
    generatedFilesDir,
    siteConfig,
    outDir,
    baseUrl,
    i18n,
    ssrTemplate,
    codeTranslations,
  } = context;
  // Plugins.
  const pluginConfigs: PluginConfig[] = loadPluginConfigs(context);
  const {
    plugins,
    pluginsRouteConfigs,
    globalData,
    themeConfigTranslated,
  } = await loadPlugins({
    pluginConfigs,
    context,
  });

  // Side-effect to replace the untranslated themeConfig by the translated one
  context.siteConfig.themeConfig = themeConfigTranslated;

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
  const {
    stylesheets = [],
    scripts = [],
    clientModules: siteConfigClientModules = [],
  } = siteConfig;
  plugins.push({
    name: 'docusaurus-bootstrap-plugin',
    options: {},
    version: {type: 'synthetic'},
    getClientModules() {
      return siteConfigClientModules;
    },
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

  const genI18n = generate(
    generatedFilesDir,
    'i18n.json',
    JSON.stringify(i18n, null, 2),
  );

  const genCodeTranslations = generate(
    generatedFilesDir,
    'codeTranslations.json',
    JSON.stringify(codeTranslations, null, 2),
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
    genI18n,
    genCodeTranslations,
  ]);

  const props: Props = {
    siteConfig,
    siteDir,
    outDir,
    baseUrl,
    i18n,
    generatedFilesDir,
    routes: pluginsRouteConfigs,
    routesPaths,
    plugins,
    headTags,
    preBodyTags,
    postBodyTags,
    ssrTemplate: ssrTemplate || ssrDefaultTemplate,
    codeTranslations,
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
