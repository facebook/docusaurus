/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions, Options} from './options';

export default function pluginCssCascadeLayers(
  _context: LoadContext,
  _options: PluginOptions,
): Plugin | null {
  return {
    name: 'docusaurus-plugin-css-cascade-layers',
  };
}

export {validateOptions} from './options';

export type {PluginOptions, Options};
