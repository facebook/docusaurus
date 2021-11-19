/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Convert Windows backslash paths to posix style paths.
 * E.g: endi\\lie -> endi/lie
 *
 * Looks like this code was originally copied from https://github.com/sindresorhus/slash/blob/main/index.js
 *
 */
export function posixPath(str: string): string {
  const isExtendedLengthPath = /^\\\\\?\\/.test(str);

  // TODO not sure why we need this
  // See https://github.com/sindresorhus/slash/pull/16#issuecomment-833528479
  // See https://github.com/facebook/docusaurus/issues/4730#issuecomment-833530370
  const hasNonAscii = /[^\u0000-\u0080]+/.test(str); // eslint-disable-line

  if (isExtendedLengthPath || hasNonAscii) {
    return str;
  }
  return str.replace(/\\/g, '/');
}
