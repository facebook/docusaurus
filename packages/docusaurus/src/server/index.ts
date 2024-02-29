/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import _ from 'lodash';
import {
  localizePath,
  DEFAULT_BUILD_DIR_NAME,
  GENERATED_FILES_DIR_NAME,
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
import {PerfLogger} from '../utils';
import {generateSiteCode} from './codegen';
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

  PerfLogger.start('Load - loadContext');
  const context = await loadContext(options);
  PerfLogger.end('Load - loadContext');

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

  PerfLogger.start('Load - loadPlugins');
  const {plugins, pluginsRouteConfigs, globalData} = await loadPlugins(context);
  PerfLogger.end('Load - loadPlugins');

  PerfLogger.start('Load - loadClientModules');
  const clientModules = loadClientModules(plugins);
  PerfLogger.end('Load - loadClientModules');

  PerfLogger.start('Load - loadHtmlTags');
  const {headTags, preBodyTags, postBodyTags} = loadHtmlTags(plugins);
  PerfLogger.end('Load - loadHtmlTags');

  PerfLogger.start('Load - loadRoutes');
  const {registry, routesChunkNames, routesConfig, routesPaths} = loadRoutes(
    pluginsRouteConfigs,
    baseUrl,
    siteConfig.onDuplicateRoutes,
  );
  PerfLogger.end('Load - loadRoutes');

  PerfLogger.start('Load - load codeTranslations');
  const codeTranslations = {
    ...(await getPluginsDefaultCodeTranslationMessages(plugins)),
    ...siteCodeTranslations,
  };
  PerfLogger.end('Load - load codeTranslations');

  PerfLogger.start('Load - loadSiteMetadata');
  const siteMetadata = await loadSiteMetadata({plugins, siteDir});
  PerfLogger.end('Load - loadSiteMetadata');

  PerfLogger.start('Load - generateSiteCode');
  await generateSiteCode({
    generatedFilesDir,
    clientModules,
    siteConfig,
    siteMetadata,
    i18n,
    codeTranslations,
    globalData,
    routesChunkNames,
    routesConfig,
    registry,
  });
  PerfLogger.end('Load - generateSiteCode');

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
