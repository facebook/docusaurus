/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const LogPlugin = require('@docusaurus/core/lib/webpack/plugins/LogPlugin');
const {compile} = require('@docusaurus/core/lib/webpack/utils');
const path = require('path');
const webpack = require('webpack');
const {injectManifest} = require('workbox-build');
const {PluginOptionSchema} = require('./pluginOptionSchema');
const Terser = require('terser-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

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
            useBuiltIns: 'usage',
            corejs: '2',
            // See https://twitter.com/jeffposnick/status/1280223070876315649
            targets: 'chrome >= 56',
          },
        ],
      ],
      plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        require.resolve('@babel/plugin-proposal-optional-chaining'),
        require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      ],
    },
  };
}

function plugin(context, options) {
  const {outDir, baseUrl} = context;
  const {
    debug,
    offlineModeActivationStrategies,
    injectManifestConfig,
    popup,
    pwaHead,
    swCustom,
    swRegister,
  } = options;

  return {
    name: 'docusaurus-plugin-pwa',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    getClientModules() {
      return isProd ? [swRegister] : [];
    },

    configureWebpack(config) {
      if (!isProd) {
        return {};
      }

      return {
        plugins: [
          new webpack.EnvironmentPlugin({
            PWA_DEBUG: debug,
            PWA_SERVICE_WORKER_URL: path.resolve(
              `${config.output.publicPath || '/'}`,
              'sw.js',
            ),
            PWA_OFFLINE_MODE_ACTIVATION_STRATEGIES: JSON.stringify(
              offlineModeActivationStrategies,
            ),
            PWA_POPUP: popup,
          }),
        ],
      };
    },

    injectHtmlTags() {
      const headTags = [];
      if (isProd && pwaHead) {
        pwaHead.forEach(({tagName, ...attributes}) =>
          headTags.push({
            tagName,
            attributes,
          }),
        );
      }
      return {headTags};
    },

    async postBuild(props) {
      if (!isProd) {
        return;
      }

      const swSourceFileTest = /\.m?js$/;

      const swWebpackConfig = {
        entry: path.resolve(__dirname, 'sw.js'),
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
          // see https://developers.google.com/web/tools/workbox/guides/using-bundlers#webpack
          minimizer: [
            !debug &&
              new Terser({
                test: swSourceFileTest,
              }),
          ].filter(Boolean),
        },
        plugins: [
          new webpack.EnvironmentPlugin({
            PWA_SW_CUSTOM: swCustom,
          }),
          new LogPlugin({
            name: 'Service Worker',
            color: 'red',
          }),
        ],
        module: {
          rules: [
            {
              test: swSourceFileTest,
              exclude: /(node_modules)/,
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
          ...(injectManifest.globPatterns || []),
        ],
        // those attributes are not overrideable
        swDest,
        swSrc: swDest,
        globDirectory: props.outDir,
      });
    },
  };
}

module.exports = plugin;

plugin.validateOptions = function validateOptions({validate, options}) {
  return validate(PluginOptionSchema, options);
};
