/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import env from 'std-env';
import merge from 'webpack-merge';
import {Configuration, Loader} from 'webpack';

import {version as cacheLoaderVersion} from 'cache-loader/package.json';

// Utility method to get style loaders
export function getStyleLoaders(
  isServer: boolean,
  cssOptions: {
    [key: string]: any;
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
  cacheOptions?: {},
): Loader | null {
  if (env.ci || env.test) {
    return null;
  }

  return {
    loader: require.resolve('cache-loader'),
    options: Object.assign(
      {
        cacheIdentifier: `cache-loader:${cacheLoaderVersion}${isServer}`,
      },
      cacheOptions,
    ),
  };
}

export function getBabelLoader(isServer: boolean, babelOptions?: {}): Loader {
  return {
    loader: require.resolve('babel-loader'),
    options: Object.assign(
      {
        babelrc: false,
        configFile: false,
        presets: [
          isServer
            ? require.resolve('../babel/server-preset')
            : require.resolve('../babel/client-preset'),
        ],
      },
      babelOptions,
    ),
  };
}

/**
 * Helper function to modify webpack config
 * @param {Object | Function} configureWebpack a webpack config or a function to modify config
 * @param {Object} config initial webpack config
 * @param {boolean} isServer indicates if this is a server webpack configuration
 * @returns {Object} final/ modified webpack config
 */
export function applyConfigureWebpack(
  configureWebpack: any,
  config: Configuration,
  isServer: boolean,
): Configuration {
  if (typeof configureWebpack === 'object') {
    return merge(config, configureWebpack);
  }

  // Export some utility functions
  const utils = {
    getStyleLoaders,
    getCacheLoader,
    getBabelLoader,
  };
  if (typeof configureWebpack === 'function') {
    const res = configureWebpack(config, isServer, utils);
    if (res && typeof res === 'object') {
      return merge(config, res);
    }
  }
  return config;
}
