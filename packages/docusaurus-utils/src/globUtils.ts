/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
