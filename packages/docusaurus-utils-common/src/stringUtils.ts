/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Adds a given string prefix to `str`. */
export function addPrefix(str: string, prefix: string): string {
  return str.startsWith(prefix) ? str : `${prefix}${str}`;
}

/** Removes a given string suffix from `str`. */
export function removeSuffix(str: string, suffix: string): string {
  if (suffix === '') {
    // str.slice(0, 0) is ""
    return str;
  }
  return str.endsWith(suffix) ? str.slice(0, -suffix.length) : str;
}

/** Adds a given string suffix to `str`. */
export function addSuffix(str: string, suffix: string): string {
  return str.endsWith(suffix) ? str : `${str}${suffix}`;
}

/** Removes a given string prefix from `str`. */
export function removePrefix(str: string, prefix: string): string {
  return str.startsWith(prefix) ? str.slice(prefix.length) : str;
}
