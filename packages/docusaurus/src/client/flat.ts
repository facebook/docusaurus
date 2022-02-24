/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RouteChunksTree} from '@docusaurus/types';

const isTree = (x: string | RouteChunksTree): x is RouteChunksTree =>
  typeof x === 'object' && !!x && Object.keys(x).length > 0;

export default function flat(target: RouteChunksTree): Record<string, string> {
  const delimiter = '.';
  const output: Record<string, string> = {};

  function step(object: RouteChunksTree, prefix?: string | number) {
    Object.keys(object).forEach((key: string | number) => {
      const value = object[key];
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
