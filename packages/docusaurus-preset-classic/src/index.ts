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
  const {debug, docs, blog, pages, sitemap, theme, ...rest} = opts;

  const themes: PluginConfig[] = [];
  themes.push(makePluginConfig('@docusaurus/theme-classic', theme));
  if (algolia) {
    themes.push(require.resolve('@docusaurus/theme-search-algolia'));
  }

  const plugins: PluginConfig[] = [];
  if (docs !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-content-docs', docs));
  }
  if (blog !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-content-blog', blog));
  }
  if (pages !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-content-pages', pages));
  }
  if (isProd && googleAnalytics) {
    plugins.push(require.resolve('@docusaurus/plugin-google-analytics'));
  }
  if (debug || (debug === undefined && !isProd)) {
    plugins.push(require.resolve('@docusaurus/plugin-debug'));
  }
  if (isProd && gtag) {
    plugins.push(require.resolve('@docusaurus/plugin-google-gtag'));
  }
  if (isProd && sitemap !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-sitemap', sitemap));
  }
  if (Object.keys(rest).length > 0) {
    throw new Error(
      `Unrecognized keys ${Object.keys(rest).join(
        ', ',
      )} found in preset-classic configuration. The allowed keys are debug, docs, blog, pages, sitemap, theme. Check the documentation: https://docusaurus.io/docs/presets#docusauruspreset-classic for more information on how to configure individual plugins.`,
    );
  }

  return {themes, plugins};
}
