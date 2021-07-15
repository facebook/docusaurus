/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Globby/Micromatch are the 2 libs we use in Docusaurus consistently

export {default as Globby} from 'globby';

import Micromatch from 'micromatch'; // Note: Micromatch is used by Globby

// The default patterns we ignore when globbing
// using _ prefix for exclusion by convention
export const GlobExcludeDefault = [
  // Ignore files starting with _
  '**/_*.{js,jsx,ts,tsx,md,mdx}',

  // Ignore folders starting with _ (including folder content)
  '**/_*/**',

  // Ignore tests
  '**/*.test.{js,jsx,ts,tsx}',
  '**/__tests__/**',
];

type Matcher = (str: string) => boolean;

export function createMatcher(patterns: string[]): Matcher {
  const regexp = new RegExp(
    patterns.map((pattern) => Micromatch.makeRe(pattern).source).join('|'),
  );
  return (str) => regexp.test(str);
}
