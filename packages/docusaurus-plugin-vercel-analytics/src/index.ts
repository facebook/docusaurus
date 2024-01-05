/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions, Options} from './options';

export default function pluginVercelAnalytics(
  context: LoadContext,
  options: PluginOptions,
): Plugin {
  if (options.id !== DEFAULT_PLUGIN_ID) {
    throw new Error(
      `You cannot use a custom plugin id option with the Vercel Analytics plugin`,
    );
  }

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

export type {PluginOptions, Options};
