/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {PrismTheme} from 'prism-react-renderer';
import {CSSProperties} from 'react';
import {DeepPartial} from 'utility-types';

export type DocsVersionPersistence = 'localStorage' | 'none';

// TODO improve types, use unions
export type NavbarItem = {
  type?: string | undefined;
  items?: NavbarItem[];
  label?: string;
  position?: 'left' | 'right';
} & Record<string, unknown>;

export type NavbarLogo = {
  src: string;
  srcDark?: string;
  width?: string | number;
  height?: string | number;
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

export type ColorModeConfig = {
  defaultMode: 'light' | 'dark';
  disableSwitch: boolean;
  respectPrefersColorScheme: boolean;
  switchConfig: {
    darkIcon: string;
    darkIconStyle: CSSProperties;
    lightIcon: string;
    lightIconStyle: CSSProperties;
  };
};

export type AnnouncementBarConfig = {
  id: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  isCloseable: boolean;
};

export type PrismConfig = {
  theme?: PrismTheme;
  darkTheme?: PrismTheme;
  defaultLanguage?: string;
  additionalLanguages?: string[];
};

export type FooterLinkItem = {
  label?: string;
  to?: string;
  href?: string;
  html?: string;
  prependBaseUrlToHref?: string;
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
    srcDark?: string;
    width?: string | number;
    height?: string | number;
    href?: string;
  };
  copyright?: string;
  links: FooterLinks[];
};

export type TableOfContents = {
  minHeadingLevel: number;
  maxHeadingLevel: number;
};

// Theme config after validation/normalization
export type ThemeConfig = {
  docs: {
    versionPersistence: DocsVersionPersistence;
  };

  // TODO we should complete this theme config type over time
  // and share it across all themes
  // and use it in the Joi validation schema?

  // TODO temporary types
  navbar: Navbar;
  colorMode: ColorModeConfig;
  announcementBar?: AnnouncementBarConfig;
  prism: PrismConfig;
  footer?: Footer;
  hideableSidebar: boolean;
  image?: string;
  metadata: Array<Record<string, string>>;
  sidebarCollapsible: boolean;
  tableOfContents: TableOfContents;
};

// User-provided theme config, unnormalized
export type UserThemeConfig = DeepPartial<ThemeConfig>;

export function useThemeConfig(): ThemeConfig {
  return useDocusaurusContext().siteConfig.themeConfig as ThemeConfig;
}
