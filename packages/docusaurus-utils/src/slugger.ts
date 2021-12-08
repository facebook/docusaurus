/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import GithubSlugger from 'github-slugger';

// We create our own abstraction on top of the lib:
// - unify usage everywhere in the codebase
// - ability to add extra options
export type SluggerOptions = {maintainCase?: boolean};

export type Slugger = {
  slug: (value: string, options?: SluggerOptions) => string;
};

export function createSlugger(): Slugger {
  const githubSlugger = new GithubSlugger();
  return {
    slug: (value, options) => githubSlugger.slug(value, options?.maintainCase),
  };
}
