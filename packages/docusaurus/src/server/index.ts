/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import _ from 'lodash';
import {
  generate,
  escapePath,
  localizePath,
  DEFAULT_BUILD_DIR_NAME,
  DEFAULT_CONFIG_FILE_NAME,
  GENERATED_FILES_DIR_NAME,
  getSocialCardUrl,
} from '@docusaurus/utils';
import {loadSiteConfig} from './config';
import {loadClientModules} from './clientModules';
import {loadPlugins} from './plugins';
import {loadRoutes} from './routes';
import {loadHtmlTags} from './htmlTags';
import {loadSiteMetadata} from './siteMetadata';
import {loadI18n} from './i18n';
import {
  readCodeTranslationFileContent,
  getPluginsDefaultCodeTranslationMessages,
} from './translations/translations';
import type {DocusaurusConfig, LoadContext, Props} from '@docusaurus/types';

export type LoadContextOptions = {
  /** Usually the CWD; can be overridden with command argument. */
  siteDir: string;
  /** Custom output directory. Can be customized with `--out-dir` option */
  outDir?: string;
  /** Custom config path. Can be customized with `--config` option */
  config?: string;
  /** Default is `i18n.defaultLocale` */
  locale?: string;
  /**
   * `true` means the paths will have the locale prepended; `false` means they
   * won't (useful for `yarn build -l zh-Hans` where the output should be
   * emitted into `build/` instead of `build/zh-Hans/`); `undefined` is like the
   * "smart" option where only non-default locale paths are localized
   */
  localizePath?: boolean;
};

/**
 * Loading context is the very first step in site building. Its options are
 * directly acquired from CLI options. It mainly loads `siteConfig` and the i18n
 * context (which includes code translations). The `LoadContext` will be passed
 * to plugin constructors.
 */
export async function loadContext(
  options: LoadContextOptions,
): Promise<LoadContext> {
  const {
    siteDir,
    outDir: baseOutDir = DEFAULT_BUILD_DIR_NAME,
    locale,
    config: customConfigFilePath,
  } = options;
  const generatedFilesDir = path.resolve(siteDir, GENERATED_FILES_DIR_NAME);

  const {siteConfig: initialSiteConfig, siteConfigPath} = await loadSiteConfig({
    siteDir,
    customConfigFilePath,
  });

  const i18n = await loadI18n(initialSiteConfig, {locale});

  const baseUrl = localizePath({
    path: initialSiteConfig.baseUrl,
    i18n,
    options,
    pathType: 'url',
  });
  const outDir = localizePath({
    path: path.resolve(siteDir, baseOutDir),
    i18n,
    options,
    pathType: 'fs',
  });

  const siteConfig: DocusaurusConfig = {...initialSiteConfig, baseUrl};

  const localizationDir = path.resolve(
    siteDir,
    i18n.path,
    i18n.localeConfigs[i18n.currentLocale]!.path,
  );

  const codeTranslationFileContent =
    (await readCodeTranslationFileContent({localizationDir})) ?? {};

  // We only need key->message for code translations
  const codeTranslations = _.mapValues(
    codeTranslationFileContent,
    (value) => value.message,
  );

  return {
    siteDir,
    generatedFilesDir,
    localizationDir,
    siteConfig,
    siteConfigPath,
    outDir,
    baseUrl,
    i18n,
    codeTranslations,
  };
}

/**
 * This is the crux of the Docusaurus server-side. It reads everything it needs—
 * code translations, config file, plugin modules... Plugins then use their
 * lifecycles to generate content and other data. It is side-effect-ful because
 * it generates temp files in the `.docusaurus` folder for the bundler.
 */
export async function load(options: LoadContextOptions): Promise<Props> {
  const {siteDir} = options;
  const context = await loadContext(options);
  const {
    generatedFilesDir,
    siteConfig,
    siteConfigPath,
    outDir,
    baseUrl,
    i18n,
    localizationDir,
    codeTranslations: siteCodeTranslations,
  } = context;
  const {plugins, pluginsRouteConfigs, globalData} = await loadPlugins(context);
  const clientModules = loadClientModules(plugins);
  const {headTags, preBodyTags, postBodyTags} = loadHtmlTags(plugins);
  const {registry, routesChunkNames, routesConfig, routesPaths} = loadRoutes(
    pluginsRouteConfigs,
    baseUrl,
    siteConfig.onDuplicateRoutes,
  );
  const codeTranslations = {
    ...(await getPluginsDefaultCodeTranslationMessages(plugins)),
    ...siteCodeTranslations,
  };
  const siteMetadata = await loadSiteMetadata({plugins, siteDir});

  // === Side-effects part ===

  const genWarning = generate(
    generatedFilesDir,
    // cSpell:ignore DONT
    'DONT-EDIT-THIS-FOLDER',
    `This folder stores temp files that Docusaurus' client bundler accesses.

DO NOT hand-modify files in this folder because they will be overwritten in the
next build. You can clear all build artifacts (including this folder) with the
\`docusaurus clear\` command.
`,
  );

  const genSiteConfig = generate(
    generatedFilesDir,
    `${DEFAULT_CONFIG_FILE_NAME}.mjs`,
    `/*
 * AUTOGENERATED - DON'T EDIT
 * Your edits in this file will be overwritten in the next build!
 * Modify the docusaurus.config.js file at your site's root instead.
 */
export default ${JSON.stringify(
      siteConfig,
      (key, value) => {
        if (key === 'socialCardService') {
          return {
            ...value,
            url: getSocialCardUrl(context),
          };
        }
        return value;
      },
      2,
    )};
`,
  );

  const genClientModules = generate(
    generatedFilesDir,
    'client-modules.js',
    `export default [
${clientModules
  // Use `require()` because `import()` is async but client modules can have CSS
  // and the order matters for loading CSS.
  .map((clientModule) => `  require('${escapePath(clientModule)}'),`)
  .join('\n')}
];
`,
  );

  const genRegistry = generate(
    generatedFilesDir,
    'registry.js',
    `export default {
${Object.entries(registry)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(
    ([chunkName, modulePath]) =>
      `  '${chunkName}': [() => import(/* webpackChunkName: '${chunkName}' */ '${modulePath}'), '${modulePath}', require.resolveWeak('${modulePath}')],`,
  )
  .join('\n')}};
`,
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

  const genSiteMetadata = generate(
    generatedFilesDir,
    'site-metadata.json',
    JSON.stringify(siteMetadata, null, 2),
  );

  await Promise.all([
    genWarning,
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

  return {
    siteConfig,
    siteConfigPath,
    siteMetadata,
    siteDir,
    outDir,
    baseUrl,
    i18n,
    localizationDir,
    generatedFilesDir,
    routes: pluginsRouteConfigs,
    routesPaths,
    plugins,
    headTags,
    preBodyTags,
    postBodyTags,
    codeTranslations,
  };
}
