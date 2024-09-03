/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// TODO move from shelljs to execa later?
// Execa is well maintained and widely used
// Even shelljs recommends execa for security / escaping:
// https://github.com/shelljs/shelljs/wiki/Security-guidelines

// Inspired by https://github.com/xxorax/node-shell-escape/blob/master/shell-escape.js
export function escapeShellArg(s: string): string {
  let res = `'${s.replace(/'/g, "'\\''")}'`;
  res = res.replace(/^(?:'')+/g, '').replace(/\\'''/g, "\\'");
  return res;
}
