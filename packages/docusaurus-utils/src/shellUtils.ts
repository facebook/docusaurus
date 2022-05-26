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

const NO_ESCAPE_REGEXP = /^[\w.-]+$/;
const DOUBLE_QUOTES_REGEXP = /"/g;

// Inspired from Execa escaping function
// https://github.com/sindresorhus/execa/blob/main/lib/command.js#L12
export function escapeShellArg(arg: string): string {
  if (NO_ESCAPE_REGEXP.test(arg)) {
    return arg;
  }

  return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
}
