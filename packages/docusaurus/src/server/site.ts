/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  localizePath,
  DEFAULT_BUILD_DIR_NAME,
  GENERATED_FILES_DIR_NAME,
} from '@docusaurus/utils';
import combinePromises from 'combine-promises';
import {loadSiteConfig} from './config';
import {getAllClientModules} from './clientModules';
import {loadPlugins, reloadPlugin} from './plugins/plugins';
import {loadHtmlTags} from './htmlTags';
import {createSiteMetadata, loadSiteVersion} from './siteMetadata';
import {loadI18n} from './i18n';
import {
  loadSiteCodeTranslations,
  getPluginsDefaultCodeTranslations,
} from './translations/translations';
import {PerfLogger} from '../utils';
import {generateSiteFiles} from './codegen/codegen';
import {getRoutesPaths, handleDuplicateRoutes} from './routes';
import {createSiteStorage} from './storage';
import type {LoadPluginsResult} from './plugins/plugins';
import type {
  DocusaurusConfig,
  GlobalData,
  LoadContext,
  Props,
  PluginIdentifier,
} from '@docusaurus/types';

export type LoadContextParams = {
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

export type LoadSiteParams = LoadContextParams;

export type Site = {
  props: Props;
  params: LoadSiteParams;
};

/**
 * Loading context is the very first step in site building. Its params are
 * directly acquired from CLI options. It mainly loads `siteConfig` and the i18n
 * context (which includes code translations). The `LoadContext` will be passed
 * to plugin constructors.
 */
export async function loadContext(
  params: LoadContextParams,
): Promise<LoadContext> {
  const {
    siteDir,
    outDir: baseOutDir = DEFAULT_BUILD_DIR_NAME,
    locale,
    config: customConfigFilePath,
  } = params;
  const generatedFilesDir = path.resolve(siteDir, GENERATED_FILES_DIR_NAME);

  const {
    siteVersion,
    loadSiteConfig: {siteConfig: initialSiteConfig, siteConfigPath},
  } = await combinePromises({
    siteVersion: loadSiteVersion(siteDir),
    loadSiteConfig: loadSiteConfig({
      siteDir,
      customConfigFilePath,
    }),
  });

  const i18n = await loadI18n(initialSiteConfig, {locale});

  const baseUrl = localizePath({
    path: initialSiteConfig.baseUrl,
    i18n,
    options: params,
    pathType: 'url',
  });
  const outDir = localizePath({
    path: path.resolve(siteDir, baseOutDir),
    i18n,
    options: params,
    pathType: 'fs',
  });
  const localizationDir = path.resolve(
    siteDir,
    i18n.path,
    i18n.localeConfigs[i18n.currentLocale]!.path,
  );

  const siteConfig: DocusaurusConfig = {...initialSiteConfig, baseUrl};

  const codeTranslations = await loadSiteCodeTranslations({localizationDir});

  const siteStorage = createSiteStorage(siteConfig);

  return {
    siteDir,
    siteVersion,
    siteStorage,
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

function createSiteProps(
  params: LoadPluginsResult & {context: LoadContext},
): Props {
  const {plugins, routes, context} = params;
  const {
    generatedFilesDir,
    siteDir,
    siteVersion,
    siteConfig,
    siteConfigPath,
    siteStorage,
    outDir,
    baseUrl,
    i18n,
    localizationDir,
    codeTranslations: siteCodeTranslations,
  } = context;

  const {headTags, preBodyTags, postBodyTags} = loadHtmlTags({
    plugins,
    router: siteConfig.future.experimental_router,
  });

  const siteMetadata = createSiteMetadata({plugins, siteVersion});

  const codeTranslations = {
    ...getPluginsDefaultCodeTranslations({plugins}),
    ...siteCodeTranslations,
  };

  handleDuplicateRoutes(routes, siteConfig.onDuplicateRoutes);
  const routesPaths = getRoutesPaths(routes, baseUrl);

  return {
    siteConfig,
    siteConfigPath,
    siteMetadata,
    siteVersion,
    siteStorage,
    siteDir,
    outDir,
    baseUrl,
    i18n,
    localizationDir,
    generatedFilesDir,
    routes,
    routesPaths,
    plugins,
    headTags,
    preBodyTags,
    postBodyTags,
    codeTranslations,
  };
}

// TODO global data should be part of site props?
async function createSiteFiles({
  site,
  globalData,
}: {
  site: Site;
  globalData: GlobalData;
}) {
  return PerfLogger.async('Create site files', async () => {
    const {
      props: {
        plugins,
        generatedFilesDir,
        siteConfig,
        siteMetadata,
        siteStorage,
        i18n,
        codeTranslations,
        routes,
        baseUrl,
      },
    } = site;
    const clientModules = getAllClientModules(plugins);
    await generateSiteFiles({
      generatedFilesDir,
      clientModules,
      siteConfig,
      siteMetadata,
      siteStorage,
      i18n,
      codeTranslations,
      globalData,
      routes,
      baseUrl,
    });
  });
}

/**
 * This is the crux of the Docusaurus server-side. It reads everything it needs—
 * code translations, config file, plugin modules... Plugins then use their
 * lifecycles to generate content and other data. It is side-effect-ful because
 * it generates temp files in the `.docusaurus` folder for the bundler.
 */
export async function loadSite(params: LoadContextParams): Promise<Site> {
  const context = await PerfLogger.async('Load context', () =>
    loadContext(params),
  );

  const {plugins, routes, globalData} = await loadPlugins(context);

  const props = createSiteProps({plugins, routes, globalData, context});

  const site: Site = {props, params};

  await createSiteFiles({
    site,
    globalData,
  });

  return site;
}

export async function reloadSite(site: Site): Promise<Site> {
  // TODO this can be optimized, for example:
  //  - plugins loading same data as before should not recreate routes/bundles
  //  - codegen does not need to re-run if nothing changed
  return loadSite(site.params);
}

export async function reloadSitePlugin(
  site: Site,
  pluginIdentifier: PluginIdentifier,
): Promise<Site> {
  const {plugins, routes, globalData} = await reloadPlugin({
    pluginIdentifier,
    plugins: site.props.plugins,
    context: site.props,
  });

  const newProps = createSiteProps({
    plugins,
    routes,
    globalData,
    context: site.props, // Props extends Context
  });

  const newSite: Site = {
    props: newProps,
    params: site.params,
  };

  // TODO optimize, bypass useless codegen if new site is similar to old site
  await createSiteFiles({site: newSite, globalData});

  return newSite;
}
