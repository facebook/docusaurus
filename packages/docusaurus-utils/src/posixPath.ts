/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Convert Windows backslash paths to posix style paths.
 * E.g: endi\lie -> endi/lie
 *
 * Returns original path if the posix counterpart is not valid Windows path.
 * This makes the legacy code that uses posixPath safe; but also makes it less
 * useful when you actually want a path with forward slashes (e.g. for URL)
 *
 * Adopted from https://github.com/sindresorhus/slash/blob/main/index.js
 */
export function posixPath(str: string): string {
  const isExtendedLengthPath = /^\\\\\?\\/.test(str);

  // Forward slashes are only valid Windows paths when they don't contain non-ascii characters.
  // eslint-disable-next-line no-control-regex
  const hasNonAscii = /[^\u0000-\u0080]+/.test(str);

  if (isExtendedLengthPath || hasNonAscii) {
    return str;
  }
  return str.replace(/\\/g, '/');
}
