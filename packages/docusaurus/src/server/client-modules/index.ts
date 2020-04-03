/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Plugin} from '@docusaurus/types';

export function loadClientModules(plugins: Plugin<any>[]): string[] {
  return plugins
    .map(plugin =>
      !plugin.getClientModules ? null : plugin.getClientModules(),
    )
    .reduce((a, b) => a.concat(b), [])
    .filter(Boolean);
}
