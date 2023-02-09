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
export type SluggerOptions = {
  /** Keep the headings' casing, otherwise make all lowercase. */
  maintainCase?: boolean;
};

export type Slugger = {
  /**
   * Takes a Markdown heading like "Josh Cena" and sluggifies it according to
   * GitHub semantics (in this case `josh-cena`). Stateful, because if you try
   * to sluggify "Josh Cena" again it would return `josh-cena-1`.
   */
  slug: (value: string, options?: SluggerOptions) => string;
};

/**
 * A thin wrapper around github-slugger. This is a factory function that returns
 * a stateful Slugger object.
 */
export function createSlugger(): Slugger {
  const githubSlugger = new GithubSlugger();
  return {
    slug: (value, options) => githubSlugger.slug(value, options?.maintainCase),
  };
}
