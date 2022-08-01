/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Globby/Micromatch are the 2 libs we use in Docusaurus consistently

import path from 'path';
import Micromatch from 'micromatch'; // Note: Micromatch is used by Globby
import {addSuffix} from './jsUtils';

/** A re-export of the globby instance. */
export {default as Globby} from 'globby';

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
 * A very thin wrapper around `Micromatch.makeRe`.
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
  const regexp = new RegExp(
    patterns.map((pattern) => Micromatch.makeRe(pattern).source).join('|'),
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
      [addSuffix(folderPath, '/'), addSuffix(folderPath, '\\')].some((p) =>
        absoluteFilePath.startsWith(p),
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
