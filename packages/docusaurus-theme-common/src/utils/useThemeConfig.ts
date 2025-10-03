/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {ThemeConfig as BaseThemeConfig} from '@docusaurus/types';
import type {Required} from 'utility-types';

export type ThemeConfig = Required<
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
 * A convenient/more semantic way to get theme config from context.
 */
export function useThemeConfig(): ThemeConfig {
  return useDocusaurusContext().siteConfig.themeConfig as ThemeConfig;
}
