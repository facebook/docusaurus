/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Props} from '@docusaurus/types';
import type {PluginOptions} from './options';

/**
 * The minimal infos the plugin needs to work
 */
export type PluginContext = Pick<Props, 'outDir' | 'baseUrl' | 'siteConfig'> & {
  options: PluginOptions;
  relativeRoutesPaths: string[];
};

/**
 * In-memory representation of redirects we want: easier to test
 * /!\ easy to be confused: "from" is the new page we should create,
 * that redirects to "to": the existing Docusaurus page
 */
export type RedirectItem = {
  /** Pathname of the new page we should create */
  from: string;
  /** Pathname of an existing Docusaurus page */
  to: string;
};
