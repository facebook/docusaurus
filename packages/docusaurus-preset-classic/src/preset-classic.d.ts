/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type Options = {
  debug?: boolean;
  docs?: false | import('@docusaurus/plugin-content-docs').Options;
  blog?: false | import('@docusaurus/plugin-content-blog').Options;
  pages?: false | import('@docusaurus/plugin-content-pages').Options;
  sitemap?: false | import('@docusaurus/plugin-sitemap').Options;
  theme?: import('@docusaurus/theme-classic').Options;
  googleAnalytics?: import('@docusaurus/plugin-google-analytics').Options;
  gtag?: import('@docusaurus/plugin-google-gtag').Options;
};

export type ThemeConfig = import('@docusaurus/types').ThemeConfig &
  import('@docusaurus/theme-common').UserThemeConfig & {
    algolia?: unknown; // TODO type plugin
  };
