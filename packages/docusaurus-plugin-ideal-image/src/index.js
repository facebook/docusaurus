/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

module.exports = function(context, options) {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: 'docusaurus-plugin-ideal-image',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    configureWebpack(config, isServer) {
      return {
        module: {
          rules: [
            {
              test: /\.(png|jpe?g|gif)$/,
              use: [
                'lqip-loader',
                {
                  loader: '@endiliey/responsive-loader',
                  options: {
                    emitFile: !isServer, // don't emit for server-side rendering
                    disable: !isProd,
                    // eslint-disable-next-line
                    adapter: require('@endiliey/responsive-loader/sharp'),
                    name: 'ideal-img/[name].[hash:hex:7].[width].[ext]',
                    ...options,
                  },
                },
              ],
            },
          ],
        },
      };
    },
  };
};
