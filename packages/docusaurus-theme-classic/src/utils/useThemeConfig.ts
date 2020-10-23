/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export type DocsVersionPersistence = 'localStorage' | 'none';

export type ThemeConfig = {
  docs: {
    versionPersistence: DocsVersionPersistence;
  };

  // TODO we should complete this theme config type over time
  // and share it across all themes
  // and use it in the Joi validation schema?

  // TODO temporary types
  navbar: any;
  colorMode: any;
  announcementBar: any;
  prism: any;
  footer: any;
  hideableSidebar: any;
};

export default function useThemeConfig(): ThemeConfig {
  return useDocusaurusContext().siteConfig.themeConfig as ThemeConfig;
}
