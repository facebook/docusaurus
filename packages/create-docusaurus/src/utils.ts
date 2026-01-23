/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {spawn} from 'node:child_process';
import type {SpawnOptions} from 'node:child_process';

/**
 * Run a command, similar to execa(cmd,args) but simpler
 * @param command
 * @param args
 * @param options
 * @returns the command exit code
 */
export async function runCommand(
  command: string,
  args: string[] = [],
  options: SpawnOptions = {},
): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const p = spawn(command, args, {stdio: 'inherit', ...options}); // ignore
    p.on('error', reject);
    p.on('close', (exitCode) =>
      exitCode !== null
        ? resolve(exitCode)
        : reject(new Error(`No exit code for command ${command}`)),
    );
  });
}

/**
 * We use a simple kebab-case-like conversion
 * It's not perfect, but good enough
 * We don't want to depend on lodash in this package
 * See https://github.com/facebook/docusaurus/pull/11653
 * @param siteName
 */
export function siteNameToPackageName(siteName: string): string {
  const match = siteName.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b|_)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g,
  );
  if (match) {
    return match.map((x) => x.toLowerCase()).join('-');
  }
  return siteName;
}
