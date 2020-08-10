/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Plugin} from '@docusaurus/types';

export default function loadRootWrappers(plugins: Plugin<unknown>[]): string[] {
  return plugins
    .map((plugin) => plugin.getRootWrapper?.() ?? undefined)
    .filter(Boolean) as string[];
}
