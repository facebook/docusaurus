/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Small helpers to replace fs-extra APIs, with the same semantics.
// Node APIs are called through the default-imported module object at call
// time (instead of destructured named imports) so that tests can intercept
// them with vi.spyOn(fs, 'writeFile')

import fs from 'node:fs/promises';
import fsCallback from 'node:fs';
import path from 'node:path';
import {promisify} from 'node:util';

/**
 * Checks if a file or directory exists, without throwing.
 * Same semantics as fs-extra `pathExists()`.
 */
export async function pathExists(filePath: string): Promise<boolean> {
  return fs.access(filePath).then(
    () => true,
    () => false,
  );
}

/**
 * Writes a file, creating the parent directories if they don't exist yet.
 * Same semantics as fs-extra `outputFile()`.
 */
export async function outputFile(
  filePath: string,
  data: Parameters<typeof fs.writeFile>[1],
  options?: Parameters<typeof fs.writeFile>[2],
): Promise<void> {
  await fs.mkdir(path.dirname(filePath), {recursive: true});
  await fs.writeFile(filePath, data, options);
}

/**
 * Reads and parses a JSON file.
 * Same semantics as fs-extra `readJSON()`: a leading UTF-8 BOM is ignored, and
 * parsing errors are prefixed with the file path.
 */
export async function readJSON(filePath: string): Promise<unknown> {
  const content = await fs.readFile(filePath, 'utf8');
  try {
    return JSON.parse(content.replace(/^\uFEFF/, ''));
  } catch (err) {
    (err as Error).message = `${filePath}: ${(err as Error).message}`;
    throw err;
  }
}

/**
 * Resolves a path to its canonical absolute path.
 * Same semantics as fs-extra `realpath()`, which uses the Node.js JavaScript
 * implementation `fs.realpath()`. In contrast, `fs/promises` `realpath()` uses
 * the native implementation, which may normalize path casing (macOS, Windows)
 * or resolve Windows subst/network drives differently from Node's module
 * resolution.
 */
export async function realpath(filePath: string): Promise<string> {
  return promisify(fsCallback.realpath)(filePath);
}
