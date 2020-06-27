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
import {TransformOptions} from '@babel/core';
import {ConfigureWebpackUtils} from '@docusaurus/types';
import detect from 'detect-port';
import isRoot from 'is-root';
import chalk from 'chalk';
import inquirer from 'inquirer';
import clearConsole from './clearConsole';
import getProcessForPort from './getProcessForPort';

import {version as cacheLoaderVersion} from 'cache-loader/package.json';

const isInteractive = process.stdout.isTTY;

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
  configureWebpack:
    | Configuration
    | ((
        config: Configuration,
        isServer: boolean,
        utils: ConfigureWebpackUtils,
      ) => Configuration),
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

export async function choosePort(
  host: string,
  defaultPort: number,
): Promise<number | null> {
  return detect(defaultPort, host).then(
    (port) =>
      new Promise((resolve) => {
        if (port === defaultPort) {
          return resolve(port);
        }
        const message =
          process.platform !== 'win32' && defaultPort < 1024 && !isRoot()
            ? `Admin permissions are required to run a server on a port below 1024.`
            : `Something is already running on port ${defaultPort}.`;
        if (isInteractive) {
          clearConsole();
          const existingProcess = getProcessForPort(defaultPort);
          const question: any = {
            type: 'confirm',
            name: 'shouldChangePort',
            message: `${chalk.yellow(
              `${message}${
                existingProcess ? ` Probably:\n  ${existingProcess}` : ''
              }`,
            )}\n\nWould you like to run the app on another port instead?`,
            default: true,
          };
          inquirer.prompt(question).then((answer: any) => {
            if (answer.shouldChangePort) {
              resolve(port);
            } else {
              resolve(null);
            }
          });
        } else {
          console.log(chalk.red(message));
          resolve(null);
        }
        return null;
      }),
    (err) => {
      throw new Error(
        `${chalk.red(`Could not find an open port at ${chalk.bold(host)}.`)}\n${
          `Network error message: ${err.message}` || err
        }\n`,
      );
    },
  );
}
