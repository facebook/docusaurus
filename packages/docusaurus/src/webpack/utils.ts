/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import env from 'std-env';
import merge from 'webpack-merge';
import webpack, {Configuration, Loader, RuleSetRule, Stats} from 'webpack';
import {TransformOptions} from '@babel/core';
import {ConfigureWebpackFn} from '@docusaurus/types';
import {version as cacheLoaderVersion} from 'cache-loader/package.json';
import {STATIC_ASSETS_DIR_NAME} from '../constants';

// Utility method to get style loaders
export function getStyleLoaders(
  isServer: boolean,
  cssOptions: {
    [key: string]: unknown;
  } = {},
): Loader[] {
  if (isServer) {
    return [
      cssOptions.modules
        ? {
            loader: require.resolve('css-loader'),
            options: cssOptions,
          }
        : require.resolve('null-loader'),
    ];
  }

  const isProd = process.env.NODE_ENV === 'production';
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: !isProd,
      },
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
      },
    },
  ];
  return loaders;
}

export function getCacheLoader(
  isServer: boolean,
  cacheOptions?: {[key: string]: unknown},
): Loader | null {
  if (env.ci || env.test) {
    return null;
  }

  return {
    loader: require.resolve('cache-loader'),
    options: {
      cacheIdentifier: `cache-loader:${cacheLoaderVersion}${isServer}`,
      ...cacheOptions,
    },
  };
}

export function getBabelLoader(
  isServer: boolean,
  babelOptions?: TransformOptions | string,
): Loader {
  let options: TransformOptions;
  if (typeof babelOptions === 'string') {
    options = {
      babelrc: false,
      configFile: babelOptions,
      caller: {name: isServer ? 'server' : 'client'},
    };
  } else {
    options = Object.assign(
      babelOptions ?? {presets: [require.resolve('../babel/preset')]},
      {
        babelrc: false,
        configFile: false,
        caller: {name: isServer ? 'server' : 'client'},
      },
    );
  }
  return {
    loader: require.resolve('babel-loader'),
    options,
  };
}

/**
 * Helper function to modify webpack config
 * @param configureWebpack a webpack config or a function to modify config
 * @param config initial webpack config
 * @param isServer indicates if this is a server webpack configuration
 * @returns final/ modified webpack config
 */
export function applyConfigureWebpack(
  configureWebpack: ConfigureWebpackFn,
  config: Configuration,
  isServer: boolean,
): Configuration {
  // Export some utility functions
  const utils = {
    getStyleLoaders,
    getCacheLoader,
    getBabelLoader,
  };
  if (typeof configureWebpack === 'function') {
    const {mergeStrategy, ...res} = configureWebpack(config, isServer, utils);
    if (res && typeof res === 'object') {
      return merge.strategy(mergeStrategy ?? {})(config, res);
    }
  }
  return config;
}

export function compile(config: Configuration[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }
      if (stats.hasErrors()) {
        stats.toJson('errors-only').errors.forEach((e) => {
          console.error(e);
        });
        reject(new Error('Failed to compile with errors.'));
      }
      if (stats.hasWarnings()) {
        // Custom filtering warnings (see https://github.com/webpack/webpack/issues/7841).
        let {warnings} = stats.toJson('errors-warnings');
        const warningsFilter = ((config[0].stats as Stats.ToJsonOptionsObject)
          ?.warningsFilter || []) as any[];

        if (Array.isArray(warningsFilter)) {
          warnings = warnings.filter((warning) =>
            warningsFilter.every((str) => !warning.includes(str)),
          );
        }

        warnings.forEach((warning) => {
          console.warn(warning);
        });
      }
      resolve();
    });
  });
}

// Inspired by https://github.com/gatsbyjs/gatsby/blob/8e6e021014da310b9cc7d02e58c9b3efe938c665/packages/gatsby/src/utils/webpack-utils.ts#L447
export function getFileLoaderUtils() {
  const loaders = {
    file: (options = {}) => {
      return {
        loader: require.resolve(`file-loader`),
        options: {
          name: `${STATIC_ASSETS_DIR_NAME}/[name]-[hash].[ext]`,
          ...options,
        },
      };
    },
    url: (options = {}) => {
      return {
        loader: require.resolve(`url-loader`),
        options: {
          limit: 10000,
          name: `${STATIC_ASSETS_DIR_NAME}[name]-[hash].[ext]`,
          fallback: require.resolve(`file-loader`),
          ...options,
        },
      };
    },
  };

  const rules = {
    /**
     * Loads image assets, inlines images via a data URI if they are below
     * the size threshold
     */
    images: (): RuleSetRule => {
      return {
        use: [loaders.url()],
        test: /\.(ico|svg|jpg|jpeg|png|gif|webp)(\?.*)?$/,
      };
    },

    /**
     * Loads audio and video and inlines them via a data URI if they are below
     * the size threshold
     */
    media: (): RuleSetRule => {
      return {
        use: [loaders.url()],
        test: /\.(mp4|webm|ogv|wav|mp3|m4a|aac|oga|flac)$/,
      };
    },

    otherAssets: (): RuleSetRule => {
      return {
        use: [loaders.file()],
        test: /\.(pdf|doc|docx|xls|xlsx|zip|rar)$/,
      };
    },
  };

  return {loaders, rules};
}
