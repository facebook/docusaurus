/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  Preset,
  LoadContext,
  PluginConfig,
  PluginOptions,
} from '@docusaurus/types';
import type {Options, ThemeConfig} from '@docusaurus/preset-classic';

function makePluginConfig(
  source: string,
  options?: PluginOptions,
): string | [string, PluginOptions] {
  if (options) {
    return [require.resolve(source), options];
  }
  return require.resolve(source);
}

export default function preset(
  context: LoadContext,
  opts: Options = {},
): Preset {
  const {siteConfig} = context;
  const {themeConfig} = siteConfig;
  const {algolia, googleAnalytics, gtag} = themeConfig as Partial<ThemeConfig>;
  const isProd = process.env.NODE_ENV === 'production';

  const themes: PluginConfig[] = [];
  themes.push(makePluginConfig('@docusaurus/theme-classic', opts.theme));
  if (algolia) {
    themes.push(require.resolve('@docusaurus/theme-search-algolia'));
  }

  const plugins: PluginConfig[] = [];
  if (opts.docs !== false) {
    plugins.push(
      makePluginConfig('@docusaurus/plugin-content-docs', opts.docs),
    );
  }
  if (opts.blog !== false) {
    plugins.push(
      makePluginConfig('@docusaurus/plugin-content-blog', opts.blog),
    );
  }
  if (opts.pages !== false) {
    plugins.push(
      makePluginConfig('@docusaurus/plugin-content-pages', opts.pages),
    );
  }
  if (isProd && googleAnalytics) {
    plugins.push(require.resolve('@docusaurus/plugin-google-analytics'));
  }
  if (opts.debug || (typeof opts.debug === 'undefined' && !isProd)) {
    plugins.push(require.resolve('@docusaurus/plugin-debug'));
  }
  if (isProd && gtag) {
    plugins.push(require.resolve('@docusaurus/plugin-google-gtag'));
  }
  if (isProd && opts.sitemap !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-sitemap', opts.sitemap));
  }

  return {themes, plugins};
}
