/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Tree} from '@generated/routesChunkNames';

const isTree = (x: string | Tree): x is Tree =>
  typeof x === 'object' && !!x && Object.keys(x).length > 0;

function flat(target: Tree): Record<string, string> {
  const delimiter = '.';
  const output: Record<string, string> = {};

  function step(object: Tree, prefix?: string | number) {
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

export default flat;
