/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {
  mergeWithCustomize,
  customizeArray,
  customizeObject,
  CustomizeRule,
} from 'webpack-merge';
import webpack, {
  Configuration,
  RuleSetRule,
  WebpackPluginInstance,
} from 'webpack';
import fs from 'fs-extra';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import path from 'path';
import crypto from 'crypto';
import chalk from 'chalk';
import {TransformOptions} from '@babel/core';
import {
  ConfigureWebpackFn,
  ConfigurePostCssFn,
  PostCssOptions,
  ConfigureWebpackUtils,
} from '@docusaurus/types';
import {
  BABEL_CONFIG_FILE_NAME,
  OUTPUT_STATIC_ASSETS_DIR_NAME,
} from '../constants';
import {memoize} from 'lodash';

// Utility method to get style loaders
export function getStyleLoaders(
  isServer: boolean,
  cssOptions: {
    [key: string]: unknown;
  } = {},
): RuleSetRule[] {
  if (isServer) {
    return cssOptions.modules
      ? [
          {
            loader: require.resolve('css-loader'),
            options: cssOptions,
          },
        ]
      : [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // Don't emit CSS files for SSR (previously used null-loader)
              // See https://github.com/webpack-contrib/mini-css-extract-plugin/issues/90#issuecomment-811991738
              emit: false,
            },
          },
          {
            loader: require.resolve('css-loader'),
            options: cssOptions,
          },
        ];
  }

  return [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: true,
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
        postcssOptions: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          plugins: [
            // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
            require('autoprefixer'),
          ],
        },
      },
    },
  ];
}

export function getCustomBabelConfigFilePath(
  siteDir: string,
): string | undefined {
  const customBabelConfigurationPath = path.join(
    siteDir,
    BABEL_CONFIG_FILE_NAME,
  );
  return fs.existsSync(customBabelConfigurationPath)
    ? customBabelConfigurationPath
    : undefined;
}

export function getBabelOptions({
  isServer,
  babelOptions,
}: {
  isServer?: boolean;
  babelOptions?: TransformOptions | string;
} = {}): TransformOptions {
  if (typeof babelOptions === 'string') {
    return {
      babelrc: false,
      configFile: babelOptions,
      caller: {name: isServer ? 'server' : 'client'},
    };
  } else {
    return Object.assign(
      babelOptions ?? {presets: [require.resolve('../babel/preset')]},
      {
        babelrc: false,
        configFile: false,
        caller: {name: isServer ? 'server' : 'client'},
      },
    );
  }
}

// Name is generic on purpose
// we want to support multiple js loader implementations (babel + esbuild)
function getDefaultBabelLoader({
  isServer,
  babelOptions,
}: {
  isServer: boolean;
  babelOptions?: TransformOptions | string;
}): RuleSetRule {
  return {
    loader: require.resolve('babel-loader'),
    options: getBabelOptions({isServer, babelOptions}),
  };
}

export const getCustomizableJSLoader = (
  jsLoader: 'babel' | ((isServer: boolean) => RuleSetRule) = 'babel',
) => ({
  isServer,
  babelOptions,
}: {
  isServer: boolean;
  babelOptions?: TransformOptions | string;
}): RuleSetRule =>
  jsLoader === 'babel'
    ? getDefaultBabelLoader({isServer, babelOptions})
    : jsLoader(isServer);

// TODO remove this before end of 2021?
const warnBabelLoaderOnce = memoize(function () {
  console.warn(
    chalk.yellow(
      'Docusaurus plans to support multiple JS loader strategies (Babel, esbuild...): "getBabelLoader(isServer)" is now deprecated in favor of "getJSLoader({isServer})".',
    ),
  );
});
const getBabelLoaderDeprecated = function getBabelLoaderDeprecated(
  isServer: boolean,
  babelOptions?: TransformOptions | string,
) {
  warnBabelLoaderOnce();
  return getDefaultBabelLoader({isServer, babelOptions});
};

// TODO remove this before end of 2021 ?
const warnCacheLoaderOnce = memoize(function () {
  console.warn(
    chalk.yellow(
      'Docusaurus uses Webpack 5 and getCacheLoader() usage is now deprecated.',
    ),
  );
});
function getCacheLoaderDeprecated() {
  warnCacheLoaderOnce();
  return null;
}

/**
 * Helper function to modify webpack config
 * @param configureWebpack a webpack config or a function to modify config
 * @param config initial webpack config
 * @param isServer indicates if this is a server webpack configuration
 * @param jsLoader custom js loader config
 * @param content content loaded by the plugin
 * @returns final/ modified webpack config
 */
export function applyConfigureWebpack(
  configureWebpack: ConfigureWebpackFn,
  config: Configuration,
  isServer: boolean,
  jsLoader: 'babel' | ((isServer: boolean) => RuleSetRule) | undefined,
  content: unknown,
): Configuration {
  // Export some utility functions
  const utils: ConfigureWebpackUtils = {
    getStyleLoaders,
    getJSLoader: getCustomizableJSLoader(jsLoader),
    getBabelLoader: getBabelLoaderDeprecated,
    getCacheLoader: getCacheLoaderDeprecated,
  };
  if (typeof configureWebpack === 'function') {
    const {mergeStrategy, ...res} = configureWebpack(
      config,
      isServer,
      utils,
      content,
    );
    if (res && typeof res === 'object') {
      // @ts-expect-error: annoying error due to enums: https://github.com/survivejs/webpack-merge/issues/179
      const customizeRules: Record<string, CustomizeRule> = mergeStrategy ?? {};
      return mergeWithCustomize({
        customizeArray: customizeArray(customizeRules),
        customizeObject: customizeObject(customizeRules),
      })(config, res);
    }
  }
  return config;
}

export function applyConfigurePostCss(
  configurePostCss: NonNullable<ConfigurePostCssFn>,
  config: Configuration,
): Configuration {
  type LocalPostCSSLoader = unknown & {
    options: {postcssOptions: PostCssOptions};
  };

  // TODO not ideal heuristic but good enough for our usecase?
  function isPostCssLoader(loader: unknown): loader is LocalPostCSSLoader {
    return !!(loader as any)?.options?.postcssOptions;
  }

  // Does not handle all edge cases, but good enough for now
  function overridePostCssOptions(entry) {
    if (isPostCssLoader(entry)) {
      entry.options.postcssOptions = configurePostCss(
        entry.options.postcssOptions,
      );
    } else if (Array.isArray(entry.oneOf)) {
      entry.oneOf.forEach(overridePostCssOptions);
    } else if (Array.isArray(entry.use)) {
      entry.use
        .filter((u) => typeof u === 'object')
        .forEach(overridePostCssOptions);
    }
  }

  config.module?.rules?.forEach(overridePostCssOptions);

  return config;
}

export function compile(config: Configuration[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);
    compiler.run((err, stats) => {
      if (err) {
        console.error(err.stack || err);
        // @ts-expect-error: see https://webpack.js.org/api/node/#error-handling
        if (err.details) {
          // @ts-expect-error: see https://webpack.js.org/api/node/#error-handling
          console.error(err.details);
        }
        reject(err);
      }
      // let plugins consume all the stats
      const errorsWarnings = stats?.toJson('errors-warnings');
      if (stats?.hasErrors()) {
        reject(new Error('Failed to compile with errors.'));
      }
      if (errorsWarnings && stats?.hasWarnings()) {
        errorsWarnings.warnings?.forEach((warning) => {
          console.warn(warning);
        });
      }
      // Webpack 5 requires calling close() so that persistent caching works
      // See https://github.com/webpack/webpack.js.org/pull/4775
      compiler.close((errClose) => {
        if (errClose) {
          console.error(
            chalk.red('Error while closing Webpack compiler:', errClose),
          );
          reject(errClose);
        } else {
          resolve();
        }
      });
    });
  });
}

type AssetFolder = 'images' | 'files' | 'fonts' | 'medias';

type FileLoaderUtils = {
  loaders: {
    file: (options: {folder: AssetFolder}) => RuleSetRule;
    url: (options: {folder: AssetFolder}) => RuleSetRule;
    inlineMarkdownImageFileLoader: string;
    inlineMarkdownLinkFileLoader: string;
  };
  rules: {
    images: () => RuleSetRule;
    fonts: () => RuleSetRule;
    media: () => RuleSetRule;
    svg: () => RuleSetRule;
    otherAssets: () => RuleSetRule;
  };
};

// Inspired by https://github.com/gatsbyjs/gatsby/blob/8e6e021014da310b9cc7d02e58c9b3efe938c665/packages/gatsby/src/utils/webpack-utils.ts#L447
export function getFileLoaderUtils(): FileLoaderUtils {
  // files/images < 10kb will be inlined as base64 strings directly in the html
  const urlLoaderLimit = 10000;

  // defines the path/pattern of the assets handled by webpack
  const fileLoaderFileName = (folder: AssetFolder) =>
    `${OUTPUT_STATIC_ASSETS_DIR_NAME}/${folder}/[name]-[hash].[ext]`;

  const loaders: FileLoaderUtils['loaders'] = {
    file: (options: {folder: AssetFolder}) => {
      return {
        loader: require.resolve(`file-loader`),
        options: {
          name: fileLoaderFileName(options.folder),
        },
      };
    },
    url: (options: {folder: AssetFolder}) => {
      return {
        loader: require.resolve(`url-loader`),
        options: {
          limit: urlLoaderLimit,
          name: fileLoaderFileName(options.folder),
          fallback: require.resolve(`file-loader`),
        },
      };
    },

    // TODO find a better solution to avoid conflicts with the ideal-image plugin
    // TODO this may require a little breaking change for ideal-image users?
    // Maybe with the ideal image plugin, all md images should be "ideal"?
    // This is used to force url-loader+file-loader on markdown images
    // https://webpack.js.org/concepts/loaders/#inline
    inlineMarkdownImageFileLoader: `!url-loader?limit=${urlLoaderLimit}&name=${fileLoaderFileName(
      'images',
    )}&fallback=file-loader!`,
    inlineMarkdownLinkFileLoader: `!file-loader?name=${fileLoaderFileName(
      'files',
    )}!`,
  };

  const rules: FileLoaderUtils['rules'] = {
    /**
     * Loads image assets, inlines images via a data URI if they are below
     * the size threshold
     */
    images: () => {
      return {
        use: [loaders.url({folder: 'images'})],
        test: /\.(ico|jpg|jpeg|png|gif|webp)(\?.*)?$/,
      };
    },

    fonts: () => {
      return {
        use: [loaders.url({folder: 'fonts'})],
        test: /\.(woff|woff2|eot|ttf|otf)$/,
      };
    },

    /**
     * Loads audio and video and inlines them via a data URI if they are below
     * the size threshold
     */
    media: () => {
      return {
        use: [loaders.url({folder: 'medias'})],
        test: /\.(mp4|webm|ogv|wav|mp3|m4a|aac|oga|flac)$/,
      };
    },

    svg: () => {
      return {
        test: /\.svg?$/,
        oneOf: [
          {
            use: [
              {
                loader: '@svgr/webpack',
                options: {
                  prettier: false,
                  svgo: true,
                  svgoConfig: {
                    plugins: [{removeViewBox: false}],
                  },
                  titleProp: true,
                  ref: ![path],
                },
              },
            ],
            // We don't want to use SVGR loader for non-React source code
            // ie we don't want to use SVGR for CSS files...
            issuer: {
              and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
            },
          },
          {
            use: [loaders.url({folder: 'images'})],
          },
        ],
      };
    },

    otherAssets: () => {
      return {
        use: [loaders.file({folder: 'files'})],
        test: /\.(pdf|doc|docx|xls|xlsx|zip|rar)$/,
      };
    },
  };

  return {loaders, rules};
}

// Ensure the certificate and key provided are valid and if not
// throw an easy to debug error
function validateKeyAndCerts({cert, key, keyFile, crtFile}) {
  let encrypted;
  try {
    // publicEncrypt will throw an error with an invalid cert
    encrypted = crypto.publicEncrypt(cert, Buffer.from('test'));
  } catch (err) {
    throw new Error(
      `The certificate "${chalk.yellow(crtFile)}" is invalid.\n${err.message}`,
    );
  }

  try {
    // privateDecrypt will throw an error with an invalid key
    crypto.privateDecrypt(key, encrypted);
  } catch (err) {
    throw new Error(
      `The certificate key "${chalk.yellow(keyFile)}" is invalid.\n${
        err.message
      }`,
    );
  }
}

// Read file and throw an error if it doesn't exist
function readEnvFile(file, type) {
  if (!fs.existsSync(file)) {
    throw new Error(
      `You specified ${chalk.cyan(
        type,
      )} in your env, but the file "${chalk.yellow(file)}" can't be found.`,
    );
  }
  return fs.readFileSync(file);
}

const appDirectory = fs.realpathSync(process.cwd());
// Get the https config
// Return cert files if provided in env, otherwise just true or false
export function getHttpsConfig(): boolean | {cert: Buffer; key: Buffer} {
  const {SSL_CRT_FILE, SSL_KEY_FILE, HTTPS} = process.env;
  const isHttps = HTTPS === 'true';

  if (isHttps && SSL_CRT_FILE && SSL_KEY_FILE) {
    const crtFile = path.resolve(appDirectory, SSL_CRT_FILE);
    const keyFile = path.resolve(appDirectory, SSL_KEY_FILE);
    const config = {
      cert: readEnvFile(crtFile, 'SSL_CRT_FILE'),
      key: readEnvFile(keyFile, 'SSL_KEY_FILE'),
    };

    validateKeyAndCerts({...config, keyFile, crtFile});
    return config;
  }
  return isHttps;
}

// See https://github.com/webpack-contrib/terser-webpack-plugin#parallel
function getTerserParallel() {
  let terserParallel: boolean | number = true;
  if (process.env.TERSER_PARALLEL === 'false') {
    terserParallel = false;
  } else if (
    process.env.TERSER_PARALLEL &&
    parseInt(process.env.TERSER_PARALLEL, 10) > 0
  ) {
    terserParallel = parseInt(process.env.TERSER_PARALLEL, 10);
  }
  return terserParallel;
}

export function getMinimizer(
  useSimpleCssMinifier = false,
): WebpackPluginInstance[] {
  const minimizer = [
    new TerserPlugin({
      parallel: getTerserParallel(),
      terserOptions: {
        parse: {
          // we want uglify-js to parse ecma 8 code. However, we don't want it
          // to apply any minification steps that turns valid ecma 5 code
          // into invalid ecma 5 code. This is why the 'compress' and 'output'
          // sections only apply transformations that are ecma 5 safe
          // https://github.com/facebook/create-react-app/pull/4234
          ecma: 8,
        },
        compress: {
          ecma: 5,
          warnings: false,
        },
        mangle: {
          safari10: true,
        },
        output: {
          ecma: 5,
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebook/create-react-app/issues/2488
          ascii_only: true,
        },
      },
    }),
  ];
  if (useSimpleCssMinifier) {
    minimizer.push(new CssMinimizerPlugin());
  } else {
    minimizer.push(
      // Using the array syntax to add 2 minimizers
      // see https://github.com/webpack-contrib/css-minimizer-webpack-plugin#array
      new CssMinimizerPlugin({
        minimizerOptions: [
          // CssNano options
          {
            preset: require.resolve('@docusaurus/cssnano-preset'),
          },
          // CleanCss options
          {
            inline: false,
            level: {
              1: {
                all: false,
              },
              2: {
                all: true,
                restructureRules: true,
                removeUnusedAtRules: false,
              },
            },
          },
        ],
        minify: [
          CssMinimizerPlugin.cssnanoMinify,
          CssMinimizerPlugin.cleanCssMinify,
        ],
      }),
    );
  }

  return minimizer;
}
