/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {ThemeConfig} from '@docusaurus/types';

export function useThemeConfig(): ThemeConfig {
  return useDocusaurusContext().siteConfig.themeConfig;
}
