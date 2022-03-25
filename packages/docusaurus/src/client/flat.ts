/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RouteChunksTree} from '@docusaurus/types';

const isTree = (x: string | RouteChunksTree): x is RouteChunksTree =>
  typeof x === 'object' && !!x && Object.keys(x).length > 0;

export default function flat(target: RouteChunksTree): {
  [keyPath: string]: string;
} {
  const delimiter = '.';
  const output: {[keyPath: string]: string} = {};

  function step(object: RouteChunksTree, prefix?: string | number) {
    Object.entries(object).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}${delimiter}${key}` : key;

      if (isTree(value)) {
        step(value, newKey);
      } else {
        output[newKey] = value;
      }
    });
  }

  step(target);
  return output;
}
