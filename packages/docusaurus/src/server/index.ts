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
  DEFAULT_BUILD_DIR_NAME,
  DEFAULT_CONFIG_FILE_NAME,
  GENERATED_FILES_DIR_NAME,
} from '../constants';
import loadClientModules from './client-modules';
import loadConfig from './config';
import {loadPlugins} from './plugins';
import loadPresets from './presets';
import loadRoutes from './routes';
import {
  DocusaurusConfig,
  DocusaurusSiteMetadata,
  HtmlTagObject,
  LoadContext,
  LoadedPlugin,
  PluginConfig,
  Props,
} from '@docusaurus/types';
import {loadHtmlTags} from './html-tags';
import {getPackageJsonVersion} from './versions';
import {handleDuplicateRoutes} from './duplicateRoutes';
import {loadI18n, localizePath} from './i18n';
import {
  readCodeTranslationFileContent,
  getPluginsDefaultCodeTranslationMessages,
} from './translations/translations';
import {mapValues} from 'lodash';
import {RuleSetRule} from 'webpack';
import admonitions from 'remark-admonitions';
import {createRequire} from 'module';
import {resolveModuleName} from './moduleShorthand';

export type LoadContextOptions = {
  customOutDir?: string;
  customConfigFilePath?: string;
  locale?: string;
  localizePath?: boolean; // undefined = only non-default locales paths are localized
};

export async function loadSiteConfig({
  siteDir,
  customConfigFilePath,
}: {
  siteDir: string;
  customConfigFilePath?: string;
}): Promise<{siteConfig: DocusaurusConfig; siteConfigPath: string}> {
  const siteConfigPathUnresolved =
    customConfigFilePath ?? DEFAULT_CONFIG_FILE_NAME;

  const siteConfigPath = path.isAbsolute(siteConfigPathUnresolved)
    ? siteConfigPathUnresolved
    : path.resolve(siteDir, siteConfigPathUnresolved);

  const siteConfig = await loadConfig(siteConfigPath);
  return {siteConfig, siteConfigPath};
}

export async function loadContext(
  siteDir: string,
  options: LoadContextOptions = {},
): Promise<LoadContext> {
  const {customOutDir, locale, customConfigFilePath} = options;
  const generatedFilesDir = path.isAbsolute(GENERATED_FILES_DIR_NAME)
    ? GENERATED_FILES_DIR_NAME
    : path.resolve(siteDir, GENERATED_FILES_DIR_NAME);

  const {siteConfig: initialSiteConfig, siteConfigPath} = await loadSiteConfig({
    siteDir,
    customConfigFilePath,
  });
  const {ssrTemplate} = initialSiteConfig;

  const baseOutDir = customOutDir
    ? path.resolve(customOutDir)
    : path.resolve(siteDir, DEFAULT_BUILD_DIR_NAME);

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
    siteConfigPath,
    outDir,
    baseUrl, // TODO to remove: useless, there's already siteConfig.baseUrl! (and yes, it's the same value, cf code above)
    i18n,
    ssrTemplate,
    codeTranslations,
  };
}

export function loadPluginConfigs(context: LoadContext): PluginConfig[] {
  let {plugins: presetPlugins, themes: presetThemes} = loadPresets(context);
  const {siteConfig, siteConfigPath} = context;
  const require = createRequire(siteConfigPath);
  function normalizeShorthand(
    pluginConfig: PluginConfig,
    pluginType: 'plugin' | 'theme',
  ): PluginConfig {
    if (typeof pluginConfig === 'string') {
      return resolveModuleName(pluginConfig, require, pluginType);
    } else if (
      Array.isArray(pluginConfig) &&
      typeof pluginConfig[0] === 'string'
    ) {
      return [
        resolveModuleName(pluginConfig[0], require, pluginType),
        pluginConfig[1] ?? {},
      ];
    }
    return pluginConfig;
  }
  presetPlugins = presetPlugins.map((plugin) =>
    normalizeShorthand(plugin, 'plugin'),
  );
  presetThemes = presetThemes.map((theme) =>
    normalizeShorthand(theme, 'theme'),
  );
  const standalonePlugins = (siteConfig.plugins || []).map((plugin) =>
    normalizeShorthand(plugin, 'plugin'),
  );
  const standaloneThemes = (siteConfig.themes || []).map((theme) =>
    normalizeShorthand(theme, 'theme'),
  );
  return [
    ...presetPlugins,
    ...presetThemes,
    // Site config should be the highest priority.
    ...standalonePlugins,
    ...standaloneThemes,
  ];
}

// Make a fake plugin to:
// - Resolve aliased theme components
// - Inject scripts/stylesheets
function createBootstrapPlugin({
  siteConfig,
}: {
  siteConfig: DocusaurusConfig;
}): LoadedPlugin {
  const {
    stylesheets = [],
    scripts = [],
    clientModules: siteConfigClientModules = [],
  } = siteConfig;
  return {
    name: 'docusaurus-bootstrap-plugin',
    content: null,
    options: {},
    version: {type: 'synthetic'},
    getClientModules() {
      return siteConfigClientModules;
    },
    injectHtmlTags: () => {
      const stylesheetsTags = stylesheets.map((source) =>
        typeof source === 'string'
          ? `<link rel="stylesheet" href="${source}">`
          : ({
              tagName: 'link',
              attributes: {
                rel: 'stylesheet',
                ...source,
              },
            } as HtmlTagObject),
      );
      const scriptsTags = scripts.map((source) =>
        typeof source === 'string'
          ? `<script src="${source}"></script>`
          : ({
              tagName: 'script',
              attributes: {
                ...source,
              },
            } as HtmlTagObject),
      );
      return {
        headTags: [...stylesheetsTags, ...scriptsTags],
      };
    },
  };
}

// Configurer Webpack fallback mdx loader for md/mdx files out of content-plugin folders
// Adds a "fallback" mdx loader for mdx files that are not processed by content plugins
// This allows to do things such as importing repo/README.md as a partial from another doc
// Not ideal solution though, but good enough for now
function createMDXFallbackPlugin({
  siteDir,
  siteConfig,
}: {
  siteDir: string;
  siteConfig: DocusaurusConfig;
}): LoadedPlugin {
  return {
    name: 'docusaurus-mdx-fallback-plugin',
    content: null,
    options: {},
    version: {type: 'synthetic'},
    configureWebpack(config, isServer, {getJSLoader}) {
      // We need the mdx fallback loader to exclude files that were already processed by content plugins mdx loaders
      // This works, but a bit hacky...
      // Not sure there's a way to handle that differently in webpack :s
      function getMDXFallbackExcludedPaths(): string[] {
        const rules: RuleSetRule[] = config?.module?.rules as RuleSetRule[];
        return rules.flatMap((rule) => {
          const isMDXRule =
            rule.test instanceof RegExp && rule.test.test('x.mdx');
          return isMDXRule ? (rule.include as string[]) : [];
        });
      }

      return {
        module: {
          rules: [
            {
              test: /(\.mdx?)$/,
              exclude: getMDXFallbackExcludedPaths(),
              use: [
                getJSLoader({isServer}),
                {
                  loader: require.resolve('@docusaurus/mdx-loader'),
                  options: {
                    staticDirs: siteConfig.staticDirectories.map((dir) =>
                      path.resolve(siteDir, dir),
                    ),
                    siteDir,
                    isMDXPartial: (_filename: string) => true, // External mdx files are always meant to be imported as partials
                    isMDXPartialFrontMatterWarningDisabled: true, // External mdx files might have frontmatter, let's just disable the warning
                    remarkPlugins: [admonitions],
                  },
                },
              ],
            },
          ],
        },
      };
    },
  };
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
    siteConfigPath,
    outDir,
    baseUrl,
    i18n,
    ssrTemplate,
    codeTranslations,
  } = context;
  // Plugins.
  const pluginConfigs: PluginConfig[] = loadPluginConfigs(context);
  const {plugins, pluginsRouteConfigs, globalData, themeConfigTranslated} =
    await loadPlugins({pluginConfigs, context});

  // Side-effect to replace the untranslated themeConfig by the translated one
  context.siteConfig.themeConfig = themeConfigTranslated;

  handleDuplicateRoutes(pluginsRouteConfigs, siteConfig.onDuplicateRoutes);

  // Site config must be generated after plugins
  // We want the generated config to have been normalized by the plugins!
  const genSiteConfig = generate(
    generatedFilesDir,
    DEFAULT_CONFIG_FILE_NAME,
    `export default ${JSON.stringify(siteConfig, null, 2)};`,
  );

  plugins.push(createBootstrapPlugin({siteConfig}));
  plugins.push(createMDXFallbackPlugin({siteDir, siteConfig}));

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
  const {registry, routesChunkNames, routesConfig, routesPaths} =
    await loadRoutes(pluginsRouteConfigs, baseUrl);

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

  const codeTranslationsWithFallbacks: Record<string, string> = {
    ...(await getPluginsDefaultCodeTranslationMessages(plugins)),
    ...codeTranslations,
  };

  const genCodeTranslations = generate(
    generatedFilesDir,
    'codeTranslations.json',
    JSON.stringify(codeTranslationsWithFallbacks, null, 2),
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
    siteConfigPath,
    siteMetadata,
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
            `Invalid ${plugin} version ${versionInfo.version}.\nAll official @docusaurus/* packages should have the exact same version as @docusaurus/core (${docusaurusVersion}).\nMaybe you want to check, or regenerate your yarn.lock or package-lock.json file?`,
          ),
        );
      }
    },
  );
}
