/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Tinyglobby/Picomatch are the 2 libs we use in Docusaurus consistently

import path from 'node:path';
import Picomatch from 'picomatch';
import * as Tinyglobby from 'tinyglobby';

/**
 * Our own glob options: we only expose the options we actually use, so that
 * we can swap the underlying lib (e.g. for Node.js native `fs.glob`).
 */
export type GlobOptions = Pick<
  Tinyglobby.GlobOptions,
  'cwd' | 'ignore' | 'absolute'
>;

/** Finds the files matching the given glob patterns, in a stable order. */
export async function glob(
  patterns: string | string[],
  options?: GlobOptions,
): Promise<string[]> {
  // Other lib options are still forwarded at runtime for retro-compatibility
  const files = await Tinyglobby.glob(patterns, {...options});
  // The crawl order depends on the file system and the JS runtime
  // See https://github.com/meta/docusaurus/pull/13031
  return files.sort(compareFilePaths);
}

/**
 * Sorts like a crawl: the files of a folder come before its subfolders.
 * Names are compared by UTF-16 code unit, so the order ignores the locale.
 */
function compareFilePaths(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  const aSegments = a.split('/');
  const bSegments = b.split('/');
  const i = findFirstDifferentIndex(aSegments, bSegments);

  const aIsFile = i === aSegments.length - 1;
  const bIsFile = i === bSegments.length - 1;
  if (aIsFile !== bIsFile) {
    return aIsFile ? -1 : 1;
  }
  return aSegments[i]! < bSegments[i]! ? -1 : 1;
}

function findFirstDifferentIndex(a: string[], b: string[]): number {
  let i = 0;
  while (a[i] === b[i]) {
    i += 1;
  }
  return i;
}

/**
 * The default glob patterns we ignore when sourcing content.
 * - Ignore files and folders starting with `_` recursively
 * - Ignore tests
 */
export const GlobExcludeDefault = [
  '**/_*.{js,jsx,ts,tsx,md,mdx}',
  '**/_*/**',
  '**/*.test.{js,jsx,ts,tsx}',
  '**/__tests__/**',
];

type Matcher = (str: string) => boolean;

/**
 * Creates a matcher that tells if a path is matched by any of the patterns.
 *
 * @see {@link createAbsoluteFilePathMatcher}
 * @param patterns A list of glob patterns. If the list is empty, it defaults to
 * matching none.
 * @returns A matcher handle that tells if a file path is matched by any of the
 * patterns.
 */
export function createMatcher(patterns: string[]): Matcher {
  if (patterns.length === 0) {
    // `/(?:)/.test("foo")` is `true`
    return () => false;
  }
  // makeRe() does not detect the OS: accept \ separators on Windows
  const options = {windows: process.platform === 'win32'};
  const regexp = new RegExp(
    patterns
      .map((pattern) => Picomatch.makeRe(pattern, options).source)
      .join('|'),
  );
  return (str) => regexp.test(str);
}

/**
 * We use match patterns like `"** /_* /**"` (ignore the spaces), where `"_*"`
 * should only be matched within a subfolder. This function would:
 * - Match `/user/sebastien/website/docs/_partials/xyz.md`
 * - Ignore `/user/_sebastien/website/docs/partials/xyz.md`
 *
 * @param patterns A list of glob patterns.
 * @param rootFolders A list of root folders to resolve the glob from.
 * @returns A matcher handle that tells if a file path is matched by any of the
 * patterns, resolved from the first root folder that contains the path.
 * @throws Throws when the returned matcher receives a path that doesn't belong
 * to any of the `rootFolders`.
 */
export function createAbsoluteFilePathMatcher(
  patterns: string[],
  rootFolders: string[],
): Matcher {
  const matcher = createMatcher(patterns);

  function getRelativeFilePath(absoluteFilePath: string) {
    const rootFolder = rootFolders.find((folderPath) =>
      ['/', '\\'].some((separator) =>
        absoluteFilePath.startsWith(
          folderPath.endsWith(separator) ? folderPath : folderPath + separator,
        ),
      ),
    );
    if (!rootFolder) {
      throw new Error(
        `createAbsoluteFilePathMatcher unexpected error, absoluteFilePath=${absoluteFilePath} was not contained in any of the root folders: ${rootFolders.join(
          ', ',
        )}`,
      );
    }
    return path.relative(rootFolder, absoluteFilePath);
  }

  return (absoluteFilePath: string) =>
    matcher(getRelativeFilePath(absoluteFilePath));
}

// Duplicated from @docusaurus/utils to keep this package dependency-free
// See https://github.com/sindresorhus/slash/blob/main/index.js
function posixPath(str: string): string {
  const isExtendedLengthPath = str.startsWith('\\\\?\\');
  if (isExtendedLengthPath) {
    return str;
  }
  return str.replace(/\\/g, '/');
}

// Glob that fix Windows path patterns
// See https://github.com/meta/docusaurus/pull/4222#issuecomment-795517329
export async function safeGlob(
  patterns: string[],
  options?: GlobOptions,
): Promise<string[]> {
  // Required for Windows support, as paths using \ should not be used by glob
  // (also using the windows hard drive prefix like c: is not a good idea)
  const globPaths = patterns.map((dirPath) =>
    posixPath(path.relative(process.cwd(), dirPath)),
  );

  return glob(globPaths, options);
}
