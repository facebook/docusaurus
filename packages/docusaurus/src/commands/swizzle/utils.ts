/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import leven from 'leven';

export function findStringIgnoringCase(
  str: string,
  values: string[],
): string | undefined {
  return values.find((v) => v.toLowerCase() === str.toLowerCase());
}

export function findClosestValue(
  str: string,
  values: string[],
  maxLevenshtein = 3,
): string | undefined {
  return values.find((v) => leven(v, str) <= maxLevenshtein);
}
