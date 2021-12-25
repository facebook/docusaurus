/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * When you have a path like C:\X\Y
 * It is not safe to use directly when generating code
 * For example, this would fail due to unescaped \: `<img src={require('${filePath}')} />`
 * But this would work: `<img src={require('${escapePath(filePath)}')} />`
 *
 * posixPath can't be used in all cases, because forward slashes are only valid
 * Windows paths when they don't contain non-ascii characters, and posixPath
 * doesn't escape those that fail to be converted.
 */
export function escapePath(str: string): string {
  const escaped = JSON.stringify(str);

  // Remove the " around the json string;
  return escaped.substring(1, escaped.length - 1);
}
