/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  mergeWithCustomize,
  customizeArray,
  customizeObject,
} from 'webpack-merge';
import {createJsLoaderFactory, getStyleLoaders} from './utils';

import type {Configuration, RuleSetRule} from 'webpack';
import type {
  Plugin,
  PostCssOptions,
  ConfigureWebpackUtils,
  LoadedPlugin,
} from '@docusaurus/types';

/**
 * Creates convenient utils to inject into the configureWebpack() lifecycle
 * @param config the Docusaurus config
 */
export async function createConfigureWebpackUtils({
  siteConfig,
}: {
  siteConfig: Parameters<typeof createJsLoaderFactory>[0]['siteConfig'];
}): Promise<ConfigureWebpackUtils> {
  return {
    getStyleLoaders,
    getJSLoader: await createJsLoaderFactory({siteConfig}),
  };
}

/**
 * Helper function to modify webpack config
 * @param configureWebpack a webpack config or a function to modify config
 * @param config initial webpack config
 * @param isServer indicates if this is a server webpack configuration
 * @param utils the <code>ConfigureWebpackUtils</code> utils to inject into the configureWebpack() lifecycle
 * @param content content loaded by the plugin
 * @returns final/ modified webpack config
 */
export function applyConfigureWebpack({
  configureWebpack,
  config,
  isServer,
  utils,
  content,
}: {
  configureWebpack: NonNullable<Plugin['configureWebpack']>;
  config: Configuration;
  isServer: boolean;
  utils: ConfigureWebpackUtils;
  content: unknown;
}): Configuration {
  if (typeof configureWebpack === 'function') {
    const {mergeStrategy, ...res} =
      configureWebpack(config, isServer, utils, content) ?? {};
    const customizeRules = mergeStrategy ?? {};
    return mergeWithCustomize({
      customizeArray: customizeArray(customizeRules),
      customizeObject: customizeObject(customizeRules),
    })(config, res);
  }
  return config;
}

export function applyConfigurePostCss(
  configurePostCss: NonNullable<Plugin['configurePostCss']>,
  config: Configuration,
): Configuration {
  type LocalPostCSSLoader = object & {
    options: {postcssOptions: PostCssOptions};
  };

  // Not ideal heuristic but good enough for our use-case?
  function isPostCssLoader(loader: unknown): loader is LocalPostCSSLoader {
    return !!(loader as LocalPostCSSLoader)?.options?.postcssOptions;
  }

  // Does not handle all edge cases, but good enough for now
  function overridePostCssOptions(entry: RuleSetRule) {
    if (isPostCssLoader(entry)) {
      entry.options.postcssOptions = configurePostCss(
        entry.options.postcssOptions,
      );
    } else if (Array.isArray(entry.oneOf)) {
      entry.oneOf.forEach((r) => {
        if (r) {
          overridePostCssOptions(r);
        }
      });
    } else if (Array.isArray(entry.use)) {
      entry.use
        .filter((u) => typeof u === 'object')
        .forEach((rule) => overridePostCssOptions(rule as RuleSetRule));
    }
  }

  config.module?.rules?.forEach((rule) =>
    overridePostCssOptions(rule as RuleSetRule),
  );

  return config;
}

// Plugin Lifecycle - configurePostCss()
function executePluginsConfigurePostCss({
  plugins,
  config,
}: {
  plugins: LoadedPlugin[];
  config: Configuration;
}): Configuration {
  let resultConfig = config;
  plugins.forEach((plugin) => {
    const {configurePostCss} = plugin;
    if (configurePostCss) {
      resultConfig = applyConfigurePostCss(
        configurePostCss.bind(plugin),
        resultConfig,
      );
    }
  });
  return resultConfig;
}

// Plugin Lifecycle - configureWebpack()
export function executePluginsConfigureWebpack({
  plugins,
  config: configInput,
  isServer,
  utils,
}: {
  plugins: LoadedPlugin[];
  config: Configuration;
  isServer: boolean;
  utils: ConfigureWebpackUtils;
}): Configuration {
  let config = configInput;

  // Step1 - Configure Webpack
  plugins.forEach((plugin) => {
    const {configureWebpack} = plugin;
    if (configureWebpack) {
      config = applyConfigureWebpack({
        configureWebpack: configureWebpack.bind(plugin), // The plugin lifecycle may reference `this`.
        config,
        isServer,
        utils,
        content: plugin.content,
      });
    }
  });

  // Step2 - For client code, configure PostCSS
  // The order matters! We want to configure PostCSS on loaders
  // that were potentially added by configureWebpack
  // See https://github.com/facebook/docusaurus/issues/10106
  // Note: it's useless to configure postCSS for the server
  if (!isServer) {
    config = executePluginsConfigurePostCss({
      plugins,
      config,
    });
  }

  return config;
}
