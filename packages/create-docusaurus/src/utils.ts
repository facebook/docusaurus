/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-expect-error: no types, but same as spawn()
import CrossSpawn from 'cross-spawn';
import type {spawn, SpawnOptions} from 'node:child_process';

// We use cross-spawn instead of spawn because of Windows compatibility issues.
// For example, "yarn" doesn't work on Windows, it requires "yarn.cmd"
// Tools like execa() use cross-spawn under the hood, and "resolve" the command
const crossSpawn: typeof spawn = CrossSpawn;

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
  // This does something similar to execa.command()
  // we split a string command (with optional args) into command+args
  // this way it's compatible with spawn()
  const [realCommand, ...baseArgs] = command.split(' ');
  const allArgs = [...baseArgs, ...args];
  if (!realCommand) {
    throw new Error(`Invalid command: ${command}`);
  }

  return new Promise<number>((resolve, reject) => {
    const p = crossSpawn(realCommand, allArgs, {stdio: 'ignore', ...options});
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
