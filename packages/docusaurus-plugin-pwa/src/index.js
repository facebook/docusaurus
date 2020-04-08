/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable import/no-extraneous-dependencies */

const {createBaseConfig} = require('@docusaurus/core/lib/webpack/base');
const LogPlugin = require('@docusaurus/core/lib/webpack/plugins/LogPlugin');
const {compile} = require('@docusaurus/core/lib/webpack/utils');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const {injectManifest} = require('workbox-build');

const defaultOptions = {
  alwaysPrecache: false,
  injectManifestConfig: {},
  pwaHead: [],
  swCustom: '',
  swRegister: path.join(__dirname, 'registerSw.js'),
  popup: '@theme/PwaReloadPopup',
};

const isProd = process.env.NODE_ENV === 'production';

function pluginOffline(_context, options = {}) {
  const pluginOptions = {
    ...defaultOptions,
    ...options,
  };

  const {
    alwaysPrecache,
    injectManifestConfig,
    popup,
    pwaHead,
    swCustom,
    swRegister,
  } = pluginOptions;

  return {
    name: 'docusaurus-plugin-pwa',

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
            ALWAYS_PRECACHE: alwaysPrecache.toString(),
            PWA_POPUP: popup,
            SERVICE_WORKER: path.resolve(
              `${config.output.publicPath || '/'}`,
              'sw.js',
            ),
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
      if (isProd) {
        const serviceWorkerConfig = merge(createBaseConfig(props), {
          entry: path.resolve(__dirname, 'sw.js'),
          target: 'webworker',

          output: {
            filename: 'sw.js',
          },

          optimization: {
            splitChunks: false,
          },

          plugins: [
            new webpack.EnvironmentPlugin({
              SW_CUSTOM: swCustom,
            }),
            new LogPlugin({
              name: 'Service Worker',
              color: 'red',
            }),
          ],
        });

        await compile([serviceWorkerConfig]);

        const swDest = path.resolve(props.outDir, 'sw.js');
        await injectManifest({
          swDest,
          swSrc: swDest,
          globDirectory: props.outDir,
          ...injectManifestConfig,
          globPatterns: [
            '**/*.{js,json,css,html}',
            '**/*.{png,jpg,jpeg,gif,svg,ico}',
            '**/*.{woff,woff2,eot,ttf,otf}',
            ...(injectManifest.globPatterns || []),
          ],
        });
      }
    },
  };
}

module.exports = pluginOffline;
