/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {ThemeConfig} from '@docusaurus/theme-search-algolia';

export function useAlgoliaThemeConfig(): ThemeConfig {
  const {
    siteConfig: {themeConfig},
  } = useDocusaurusContext();
  return themeConfig as ThemeConfig;
}
