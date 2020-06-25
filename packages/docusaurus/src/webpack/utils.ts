/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import env from 'std-env';
import merge from 'webpack-merge';
import {Configuration, Loader, RuleSetRule} from 'webpack';
import {TransformOptions} from '@babel/core';
import {ConfigureWebpackFn} from '@docusaurus/types';
import {version as cacheLoaderVersion} from 'cache-loader/package.json';

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
    const {mergeStrategies, ...res} = configureWebpack(config, isServer, utils);
    if (res && typeof res === 'object') {
      return merge.strategy(mergeStrategies ?? {})(config, res);
    }
  }
  return config;
}

// Inspired by https://github.com/gatsbyjs/gatsby/blob/8e6e021014da310b9cc7d02e58c9b3efe938c665/packages/gatsby/src/utils/webpack-utils.ts#L447
export function getLoaderUtils() {
  const assetRelativeRoot = '/'; // TODO

  const loaders = {
    file: (options = {}) => {
      return {
        loader: require.resolve(`file-loader`),
        options: {
          name: `${assetRelativeRoot}[name]-[hash].[ext]`,
          ...options,
        },
      };
    },
    url: (options = {}) => {
      return {
        loader: require.resolve(`url-loader`),
        options: {
          limit: 10000,
          name: `${assetRelativeRoot}[name]-[hash].[ext]`,
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
        test: /\.pdf$/,
      };
    },
  };

  return {loaders, rules};
}
