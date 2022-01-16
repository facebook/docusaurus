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

// For a given existing route path,
// return all the paths from which we should redirect from
export type CreateRedirectsFnOption = (
  path: string,
) => string[] | string | null | undefined;

export type PluginOptions = {
  id: string;
  fromExtensions: string[];
  toExtensions: string[];
  redirects: RedirectOption[];
  createRedirects?: CreateRedirectsFnOption;
};

export type Options = Partial<PluginOptions>;
