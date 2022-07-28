/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import dict from './dict';

type Map = {[index: string]: string};

const pinyin: Map = (dict as string[][]).reduce((output: Map, [py, chars]) => {
  chars!.split('').forEach((char) => {
    output[char] = py as string;
  });
  return output;
}, {});

console.log(JSON.stringify(pinyin, undefined, 2));
