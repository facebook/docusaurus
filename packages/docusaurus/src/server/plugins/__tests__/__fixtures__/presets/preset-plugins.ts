/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {LoadContext, Preset} from '@docusaurus/types';

export default function preset(
  context: LoadContext,
  opts: {theme: {}; test: {}},
) {
  return {
    themes: [['@docusaurus/theme-classic', opts.theme], null],
    plugins: [['@docusaurus/plugin-test', opts.theme], false],
  } satisfies Preset;
}
