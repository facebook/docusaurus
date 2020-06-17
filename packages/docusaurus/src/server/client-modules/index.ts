/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Plugin} from '@docusaurus/types';

export function loadClientModules(plugins: Plugin<any>[]): string[] {
  return ([] as string[]).concat(
    ...plugins
      .map<any>(
        (plugin) => plugin.getClientModules && plugin.getClientModules(),
      )
      .filter(Boolean),
  );
}

const abc = 42;

const test = {
  abc,
};

console.debug('test', test);
