/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tries to create a RegExp from a string, coming from the Docusaurus config.
 * If it fails to create a RegExp it returns the input string.
 *
 * @param possibleRegexp string that is possibly a regex
 * @returns a Regex if possible, otherwise the string
 */
export function getRegexpOrString(possibleRegexp: string): RegExp | string {
  try {
    return new RegExp(new RegExp(possibleRegexp).source, 'g');
  } catch (e) {
    return possibleRegexp;
  }
}
