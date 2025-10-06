/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {ThemeConfig as BaseThemeConfig} from '@docusaurus/types';
import type {DeepRequired, Overwrite, Required} from 'utility-types';

type RawThemeConfig = Required<
  BaseThemeConfig,
  | 'blog'
  | 'colorMode'
  | 'docs'
  | 'metadata'
  | 'navbar'
  | 'prism'
  | 'tableOfContents'
>;

/**
 * TODO Docusaurus v4: use interface + declaration merging to enhance
 * Theme config after validation/normalization
 *
 * TODO we should complete this theme config type over time
 * and share it across all themes
 * and use it in the Joi validation schema?
 */
export type ThemeConfig = Overwrite<
  RawThemeConfig,
  {
    docs: DeepRequired<RawThemeConfig['docs']>;
    blog: DeepRequired<RawThemeConfig['blog']>;
    navbar: DeepRequired<RawThemeConfig['navbar']>;
    colorMode: DeepRequired<RawThemeConfig['colorMode']>;
    announcementBar?: Required<NonNullable<RawThemeConfig['announcementBar']>>;
    prism: DeepRequired<RawThemeConfig['prism']>;
    footer?: Required<NonNullable<RawThemeConfig['footer']>, 'links' | 'style'>;
    tableOfContents: DeepRequired<RawThemeConfig['tableOfContents']>;
  }
>;

/**
 * A convenient/more semantic way to get theme config from context.
 */
export function useThemeConfig(): ThemeConfig {
  return useDocusaurusContext().siteConfig.themeConfig as ThemeConfig;
}
