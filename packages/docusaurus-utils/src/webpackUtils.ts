/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {escapePath} from './pathUtils';
import {
  WEBPACK_URL_LOADER_LIMIT,
  OUTPUT_STATIC_ASSETS_DIR_NAME,
} from './constants';
import type {RuleSetRule, LoaderContext} from 'webpack';

export type WebpackCompilerName = 'server' | 'client';

export function getWebpackLoaderCompilerName(
  context: LoaderContext<unknown>,
): WebpackCompilerName {
  // eslint-disable-next-line no-underscore-dangle
  const compilerName = context._compiler?.name;
  switch (compilerName) {
    case 'server':
    case 'client':
      return compilerName;
    default:
      throw new Error(
        `Cannot get valid Docusaurus webpack compiler name. Found compilerName=${compilerName}`,
      );
  }
}

type AssetFolder = 'images' | 'files' | 'fonts' | 'medias';

type FileLoaderUtils = {
  loaders: {
    file: (options: {folder: AssetFolder}) => RuleSetRule;
    url: (options: {folder: AssetFolder}) => RuleSetRule;
    inlineMarkdownImageFileLoader: string;
    inlineMarkdownAssetImageFileLoader: string;
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

/**
 * Returns unified loader configurations to be used for various file types.
 *
 * Inspired by https://github.com/gatsbyjs/gatsby/blob/8e6e021014da310b9cc7d02e58c9b3efe938c665/packages/gatsby/src/utils/webpack-utils.ts#L447
 */
export function getFileLoaderUtils(): FileLoaderUtils {
  // Files/images < urlLoaderLimit will be inlined as base64 strings directly in
  // the html
  const urlLoaderLimit = WEBPACK_URL_LOADER_LIMIT;

  const fileLoaderFileName = (folder: AssetFolder) =>
    path.posix.join(
      OUTPUT_STATIC_ASSETS_DIR_NAME,
      folder,
      '[name]-[contenthash].[ext]',
    );

  const loaders: FileLoaderUtils['loaders'] = {
    file: (options: {folder: AssetFolder}) => ({
      loader: require.resolve(`file-loader`),
      options: {
        name: fileLoaderFileName(options.folder),
      },
    }),
    url: (options: {folder: AssetFolder}) => ({
      loader: require.resolve('url-loader'),
      options: {
        limit: urlLoaderLimit,
        name: fileLoaderFileName(options.folder),
        fallback: require.resolve('file-loader'),
      },
    }),

    // TODO avoid conflicts with the ideal-image plugin
    // TODO this may require a little breaking change for ideal-image users?
    // Maybe with the ideal image plugin, all md images should be "ideal"?
    // This is used to force url-loader+file-loader on markdown images
    // https://webpack.js.org/concepts/loaders/#inline
    inlineMarkdownImageFileLoader: `!${escapePath(
      require.resolve('url-loader'),
    )}?limit=${urlLoaderLimit}&name=${fileLoaderFileName(
      'images',
    )}&fallback=${escapePath(require.resolve('file-loader'))}!`,
    inlineMarkdownAssetImageFileLoader: `!${escapePath(
      require.resolve('file-loader'),
    )}?name=${fileLoaderFileName('images')}!`,
    inlineMarkdownLinkFileLoader: `!${escapePath(
      require.resolve('file-loader'),
    )}?name=${fileLoaderFileName('files')}!`,
  };

  const rules: FileLoaderUtils['rules'] = {
    /**
     * Loads image assets, inlines images via a data URI if they are below
     * the size threshold
     */
    images: () => ({
      use: [loaders.url({folder: 'images'})],
      test: /\.(?:ico|jpe?g|png|gif|webp|avif)(?:\?.*)?$/i,
    }),

    fonts: () => ({
      use: [loaders.url({folder: 'fonts'})],
      test: /\.(?:woff2?|eot|ttf|otf)$/i,
    }),

    /**
     * Loads audio and video and inlines them via a data URI if they are below
     * the size threshold
     */
    media: () => ({
      use: [loaders.url({folder: 'medias'})],
      test: /\.(?:mp4|avi|mov|mkv|mpg|mpeg|vob|wmv|m4v|webm|ogv|wav|mp3|m4a|aac|oga|flac)$/i,
    }),

    svg: () => ({
      test: /\.svg$/i,
      oneOf: [
        {
          use: [
            {
              loader: require.resolve('@svgr/webpack'),
              options: {
                prettier: false,
                svgo: true,
                svgoConfig: {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeTitle: false,
                          removeViewBox: false,
                        },
                      },
                    },
                  ],
                },
                titleProp: true,
                ref: ![path],
              },
            },
          ],
          // We don't want to use SVGR loader for non-React source code
          // ie we don't want to use SVGR for CSS files...
          issuer: {
            and: [/\.(?:tsx?|jsx?|mdx?)$/i],
          },
        },
        {
          use: [loaders.url({folder: 'images'})],
        },
      ],
    }),

    otherAssets: () => ({
      use: [loaders.file({folder: 'files'})],
      test: /\.(?:pdf|docx?|xlsx?|zip|rar)$/i,
    }),
  };

  return {loaders, rules};
}
