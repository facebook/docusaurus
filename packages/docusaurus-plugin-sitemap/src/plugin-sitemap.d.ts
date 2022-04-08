/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {EnumChangefreq} from 'sitemap';

export type PluginOptions = {
  /** @see https://www.sitemaps.org/protocol.html#xmlTagDefinitions */
  changefreq: EnumChangefreq;
  /** @see https://www.sitemaps.org/protocol.html#xmlTagDefinitions */
  priority: number;
  /**
   * A list of glob patterns; matching route paths will be filtered from the
   * sitemap. Note that you may need to include the base URL in here.
   */
  ignorePatterns: string[];
};

export type Options = Partial<PluginOptions>;
