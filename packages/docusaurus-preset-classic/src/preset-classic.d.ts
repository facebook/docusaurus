/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Options as DocsPluginOptions} from '@docusaurus/plugin-content-docs';
import type {Options as BlogPluginOptions} from '@docusaurus/plugin-content-blog';
import type {Options as PagesPluginOptions} from '@docusaurus/plugin-content-pages';
import type {Options as SitemapPluginOptions} from '@docusaurus/plugin-sitemap';
import type {Options as GAPluginOptions} from '@docusaurus/plugin-google-analytics';
import type {Options as GtagPluginOptions} from '@docusaurus/plugin-google-gtag';
import type {Options as ThemeOptions} from '@docusaurus/theme-classic';
import type {ThemeConfig as BaseThemeConfig} from '@docusaurus/types';
import type {UserThemeConfig as ClassicThemeConfig} from '@docusaurus/theme-common';
import type {UserThemeConfig as AlgoliaThemeConfig} from '@docusaurus/theme-search-algolia';

export type Options = {
  debug?: boolean;
  docs?: false | DocsPluginOptions;
  blog?: false | BlogPluginOptions;
  pages?: false | PagesPluginOptions;
  sitemap?: false | SitemapPluginOptions;
  theme?: ThemeOptions;
  googleAnalytics?: GAPluginOptions;
  gtag?: GtagPluginOptions;
};

export type ThemeConfig = BaseThemeConfig &
  ClassicThemeConfig &
  AlgoliaThemeConfig;
