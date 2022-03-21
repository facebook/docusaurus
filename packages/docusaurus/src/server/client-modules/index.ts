/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import type {LoadedPlugin} from '@docusaurus/types';

export default function loadClientModules(
  plugins: LoadedPlugin<unknown>[],
): string[] {
  return plugins.flatMap(
    (plugin) =>
      plugin.getClientModules?.().map((p) => path.resolve(plugin.path, p)) ??
      [],
  );
}
