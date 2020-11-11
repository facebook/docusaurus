/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export type DocsVersionPersistence = 'localStorage' | 'none';

// TODO improve
export type NavbarItem = {
  items: NavbarItem[];
  label?: string;
};

// TODO improve
export type Navbar = {
  title?: string;
  items: NavbarItem[];
};

// TODO improve
export type FooterLinkItem = {
  label?: string;
};
export type FooterLinks = {
  title?: string;
  items: FooterLinkItem[];
};
export type Footer = {
  copyright?: string;
  links: FooterLinks[];
};

export type ThemeConfig = {
  docs: {
    versionPersistence: DocsVersionPersistence;
  };

  // TODO we should complete this theme config type over time
  // and share it across all themes
  // and use it in the Joi validation schema?

  // TODO temporary types
  navbar: Navbar;
  colorMode: any;
  announcementBar: any;
  prism: any;
  footer: Footer;
  hideableSidebar: any;
};

export default function useThemeConfig(): ThemeConfig {
  return useDocusaurusContext().siteConfig.themeConfig as ThemeConfig;
}
