/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import webpack, {type Configuration} from 'webpack';
import WebpackBar from 'webpackbar';
import Terser from 'terser-webpack-plugin';
import {injectManifest} from 'workbox-build';
import {normalizeUrl} from '@docusaurus/utils';
import logger from '@docusaurus/logger';
import {compile} from '@docusaurus/core/lib/webpack/utils';
import {readDefaultCodeTranslationMessages} from '@docusaurus/theme-translations';
import type {HtmlTags, LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions} from '@docusaurus/plugin-pwa';

const PluginName = 'docusaurus-plugin-pwa';

function getSWBabelLoader() {
  return {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      configFile: false,
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            useBuiltIns: 'entry',
            corejs: '3',
            // See https://twitter.com/jeffposnick/status/1280223070876315649
            targets: 'chrome >= 56',
          },
        ],
      ],
    },
  };
}

export default function pluginPWA(
  context: LoadContext,
  options: PluginOptions,
): Plugin<void> | null {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }
  if (context.siteConfig.future.experimental_router === 'hash') {
    logger.warn(
      `${PluginName} does not support the Hash Router and will be disabled.`,
    );
    return null;
  }

  const {
    outDir,
    baseUrl,
    i18n: {currentLocale},
  } = context;
  const {
    debug,
    offlineModeActivationStrategies,
    injectManifestConfig,
    pwaHead,
    swCustom,
    swRegister,
  } = options;

  return {
    name: PluginName,

    getThemePath() {
      return '../lib/theme';
    },
    getTypeScriptThemePath() {
      return '../src/theme';
    },

    getClientModules() {
      return swRegister ? [swRegister] : [];
    },

    getDefaultCodeTranslationMessages() {
      return readDefaultCodeTranslationMessages({
        locale: currentLocale,
        name: 'plugin-pwa',
      });
    },

    configureWebpack(config) {
      return {
        plugins: [
          new webpack.EnvironmentPlugin({
            PWA_DEBUG: debug,
            PWA_SERVICE_WORKER_URL: path.posix.resolve(
              `${(config.output?.publicPath as string) || '/'}`,
              'sw.js',
            ),
            PWA_OFFLINE_MODE_ACTIVATION_STRATEGIES:
              offlineModeActivationStrategies,
          }),
        ],
      };
    },

    injectHtmlTags() {
      const headTags: HtmlTags = [];
      pwaHead.forEach(({tagName, ...attributes}) => {
        (['href', 'content'] as const).forEach((attribute) => {
          const attributeValue = attributes[attribute];

          if (!attributeValue) {
            return;
          }

          const attributePath =
            !!path.extname(attributeValue) && attributeValue;

          if (attributePath && !attributePath.startsWith(baseUrl)) {
            attributes[attribute] = normalizeUrl([baseUrl, attributeValue]);
          }
        });

        return headTags.push({
          tagName,
          attributes,
        });
      });
      return {headTags};
    },

    async postBuild(props) {
      const swSourceFileTest = /\.m?js$/;

      const swWebpackConfig: Configuration = {
        entry: require.resolve('./sw.js'),
        output: {
          path: outDir,
          filename: 'sw.js',
          publicPath: baseUrl,
        },
        target: 'webworker',
        mode: debug ? 'development' : 'production',
        devtool: debug ? 'source-map' : false,
        optimization: {
          splitChunks: false,
          minimize: !debug,
          // See https://developers.google.com/web/tools/workbox/guides/using-bundlers#webpack
          minimizer: debug
            ? []
            : [
                new Terser({
                  test: swSourceFileTest,
                }),
              ],
        },
        plugins: [
          new webpack.EnvironmentPlugin({
            // Fallback value required with Webpack 5
            PWA_SW_CUSTOM: swCustom ?? '',
          }),
          new WebpackBar({
            name: 'Service Worker',
            color: 'red',
          }),
        ],
        module: {
          rules: [
            {
              test: swSourceFileTest,
              exclude: /node_modules/,
              use: getSWBabelLoader(),
            },
          ],
        },
      };

      await compile([swWebpackConfig]);

      const swDest = path.resolve(props.outDir, 'sw.js');

      await injectManifest({
        ...injectManifestConfig,
        globPatterns: [
          '**/*.{js,json,css,html}',
          '**/*.{png,jpg,jpeg,gif,svg,ico}',
          '**/*.{woff,woff2,eot,ttf,otf}',
          // @ts-expect-error: internal API?
          ...((injectManifest.globPatterns as string[] | undefined) ?? []),
        ],
        // Those attributes are not overrideable
        swDest,
        swSrc: swDest,
        globDirectory: props.outDir,
      });
    },
  };
}

export {validateOptions} from './options';
