/**
 * Copyright (c) 2020-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs');
const path = require('path');
const {EnvironmentPlugin} = require('webpack');
const {copyWorkboxLibraries, injectManifest} = require('workbox-build');
const Terser = require('terser');

const defaultOptions = {
  injectManifestConfig: {},
  pwaHead: [],
  swCustom: '',
  swRegister: path.join(__dirname, 'registerSw.js'),
};

const isProd = process.env.NODE_ENV === 'production';

function pluginOffline(_context, options = {}) {
  const pluginOptions = {
    ...defaultOptions,
    ...options,
  };

  const {injectManifestConfig, pwaHead, swCustom, swRegister} = pluginOptions;

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
          new EnvironmentPlugin({
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

    async postBuild({outDir}) {
      if (isProd) {
        const swDest = path.resolve(outDir, 'sw.js');

        const workboxDir = await copyWorkboxLibraries(outDir);

        // Clear dev.js files from workbox dir
        const fullWorkboxDir = path.resolve(outDir, workboxDir);
        fs.readdirSync(fullWorkboxDir).forEach(file => {
          if (file.includes('.dev')) {
            fs.unlinkSync(path.resolve(fullWorkboxDir, file));
          }
        });

        await injectManifest({
          swDest,
          swSrc: path.resolve(__dirname, 'sw.js'),
          globDirectory: outDir,
          ...injectManifestConfig,
          globPatterns: [
            '**/*.{js,json,css,html}',
            '**/*.{png,jpg,jpeg,gif,svg,ico}',
            '**/*.{woff,woff2,eot,ttf,otf}',
            ...(injectManifest.globPatterns || []),
          ],
          globIgnores: [
            'server.bundle.js',
            ...(injectManifestConfig.globIgnores || []),
          ],
        });

        let swDestContents = fs.readFileSync(swDest, 'utf-8');
        swDestContents = swDestContents.replace('<WORKBOX_DIR>', workboxDir);

        if (swCustom) {
          const swCustomContents = fs.readFileSync(swCustom, 'utf-8');
          swDestContents += swCustomContents;
        }

        const {code} = Terser.minify(swDestContents, {
          compress: true,
          mangle: true,
        });
        fs.writeFileSync(swDest, code, 'utf-8');
      }
    },
  };
}

module.exports = pluginOffline;
