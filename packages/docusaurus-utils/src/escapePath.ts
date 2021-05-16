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
 * Workaround for issue in posixPath, maybe we won't need it anymore soon?
 * https://github.com/facebook/docusaurus/issues/4730#issuecomment-833530370
 * https://github.com/sindresorhus/slash/pull/16#issuecomment-833528479
 */
export function escapePath(str: string): string {
  const escaped = JSON.stringify(str);

  // Remove the " around the json string;
  return escaped.substring(1, escaped.length - 1);
}
