/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions, Options} from './options';

export default function pluginVercelAnalytics(
  context: LoadContext,
  options: PluginOptions,
): Plugin {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    name: 'docusaurus-plugin-vercel-analytics',

    getClientModules() {
      return isProd ? ['./analytics'] : [];
    },

    contentLoaded({actions}) {
      actions.setGlobalData(options);
    },
  };
}

export {validateOptions} from './options';

export type {PluginOptions, Options};
