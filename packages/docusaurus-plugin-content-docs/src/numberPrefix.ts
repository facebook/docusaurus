/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function stripNumberPrefix(str: string) {
  const numberPrefixPattern = /(?:^(\d)+(\s)*([-_.])+(\s)*)(?<suffix>.*)/;
  const result = numberPrefixPattern.exec(str);
  return result?.groups?.suffix ?? str;
}
