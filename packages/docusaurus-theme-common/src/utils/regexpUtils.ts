/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Matches a string regex (as provided from the config) against a target in a
 * null-safe fashion, case insensitive and global.
 */
export function isRegexpStringMatch(
  regexAsString?: string,
  valueToTest?: string,
): boolean {
  if (
    typeof regexAsString === 'undefined' ||
    typeof valueToTest === 'undefined'
  ) {
    return false;
  }

  return new RegExp(regexAsString, 'gi').test(valueToTest);
}
