/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Props} from '@docusaurus/types';

export type PluginOptions = {
  fromExtensions: string[];
  toExtensions: string[];
  createRedirects?: RedirectsCreator;
};

export type UserPluginOptions = Partial<PluginOptions>;

// For a given existing route path,
// return all the paths from which we should redirect from
export type RedirectsCreator = (
  routePath: string,
) => string[] | null | undefined;

// Having an in-memory representation of wanted redirects is easier to test
export type RedirectMetadata = {
  fromRoutePath: string;
  toRoutePath: string;
  toUrl: string;
  redirectPageContent: string;
  redirectAbsoluteFilePath: string;
};

export type PluginContext = Pick<
  Props,
  'routesPaths' | 'siteConfig' | 'outDir'
> & {
  options: PluginOptions;
};
