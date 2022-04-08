/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type RedirectOption = {
  to: string;
  from: string | string[];
};

export type PluginOptions = {
  /** Plugin ID. */
  id: string;
  /** The extensions to be removed from the route after redirecting. */
  fromExtensions: string[];
  /** The extensions to be appended to the route after redirecting. */
  toExtensions: string[];
  /** The list of redirect rules, each one with multiple `from`s → one `to`. */
  redirects: RedirectOption[];
  /**
   * A callback to create a redirect rule.
   * @returns All the paths from which we should redirect to `path`
   */
  createRedirects?: (
    /** An existing Docusaurus route path */
    path: string,
  ) => string[] | string | null | undefined;
};

export type Options = Partial<PluginOptions>;
