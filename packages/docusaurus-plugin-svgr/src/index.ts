/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createLoader} from './svgrLoader';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions, Options} from './options';

export type {SVGRConfig, SVGOConfig} from './types';

export default function pluginSVGR(
  context: LoadContext,
  options: PluginOptions,
): Plugin {
  return {
    name: 'docusaurus-plugin-svgr',
    configureWebpack: (config, isServer) => {
      return {
        mergeStrategy: {
          module: {
            rules: {
              test: 'match',
              use: {
                loader: 'match',
                options: 'replace',
              },
            },
          },
        },
        module: {
          rules: [createLoader({isServer, svgrConfig: options.svgrConfig})],
        },
      };
    },
  };
}

export {validateOptions} from './options';

export type {PluginOptions, Options};
