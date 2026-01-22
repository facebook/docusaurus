/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {spawn} from 'node:child_process';

export async function run(
  command: string,
  args: string[] = [],
): Promise<number | null> {
  return new Promise<number | null>((resolve, reject) => {
    const p = spawn(command, args, {stdio: 'inherit'}); // ignore
    p.on('error', reject);
    p.on('close', (exitCode) =>
      exitCode
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
