/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import webpack from 'webpack';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions} from '@docusaurus/plugin-vercel-analytics';

export default function pluginVercelAnalytics(
  context: LoadContext,
  options: PluginOptions,
): Plugin {
  const isProd = process.env.NODE_ENV === 'production';

  const {debug, mode} = options;

  return {
    name: 'docusaurus-plugin-vercel-analytics',

    getClientModules() {
      return isProd ? ['./analytics'] : [];
    },

    configureWebpack() {
      if (!isProd) {
        return {};
      }

      return {
        plugins: [
          new webpack.EnvironmentPlugin({
            VERCEL_ANALYTICS_DEBUG: debug,
            VERCEL_ANALYTICS_MODE: mode,
          }),
        ],
      };
    },
  };
}
