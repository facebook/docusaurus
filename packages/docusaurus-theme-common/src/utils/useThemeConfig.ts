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
  items?: NavbarItem[];
  label?: string;
};

export type NavbarLogo = {
  src: string;
  srcDark?: string;
  href?: string;
  target?: string;
  alt?: string;
};

// TODO improve
export type Navbar = {
  style: 'dark' | 'primary';
  hideOnScroll: boolean;
  title?: string;
  items: NavbarItem[];
  logo?: NavbarLogo;
};

export type FooterLinkItem = {
  label?: string;
  to?: string;
  href?: string;
  html?: string;
};
export type FooterLinks = {
  title?: string;
  items: FooterLinkItem[];
};
export type Footer = {
  style: 'light' | 'dark';
  logo?: {
    alt?: string;
    src?: string;
    href?: string;
  };
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
  footer: Footer | undefined;
  hideableSidebar: any;
};

export function useThemeConfig(): ThemeConfig {
  return useDocusaurusContext().siteConfig.themeConfig as ThemeConfig;
}
