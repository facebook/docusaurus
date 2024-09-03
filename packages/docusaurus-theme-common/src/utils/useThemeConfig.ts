/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {PrismTheme} from 'prism-react-renderer';
import type {DeepPartial} from 'utility-types';
import type {MagicCommentConfig} from './codeBlockUtils';

export type DocsVersionPersistence = 'localStorage' | 'none';

// TODO improve types, use unions
export type NavbarItem = {
  type?: string | undefined;
  items?: NavbarItem[];
  label?: string;
  position?: 'left' | 'right';
} & {[key: string]: unknown};

type BaseLogo = {
  alt?: string;
  src: string;
  srcDark?: string;
  href?: string;
  width?: string | number;
  height?: string | number;
  target?: string;
  style?: object;
  className?: string;
};

export type NavbarLogo = BaseLogo;

// TODO improve
export type Navbar = {
  style?: 'dark' | 'primary';
  hideOnScroll: boolean;
  title?: string;
  items: NavbarItem[];
  logo?: NavbarLogo;
};

export type ColorModeConfig = {
  defaultMode: 'light' | 'dark';
  disableSwitch: boolean;
  respectPrefersColorScheme: boolean;
};

export type AnnouncementBarConfig = {
  id: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  isCloseable: boolean;
};

export type PrismConfig = {
  theme: PrismTheme;
  darkTheme?: PrismTheme;
  defaultLanguage?: string;
  additionalLanguages: string[];
  magicComments: MagicCommentConfig[];
};

export type FooterLinkItem = {
  label?: string;
  to?: string;
  href?: string;
  html?: string;
  prependBaseUrlToHref?: string;
} & {[key: string]: unknown};

export type FooterLogo = BaseLogo;

export type FooterBase = {
  style: 'light' | 'dark';
  logo?: FooterLogo;
  copyright?: string;
};

export type MultiColumnFooter = FooterBase & {
  links: {
    title: string | null;
    items: FooterLinkItem[];
  }[];
};

export type SimpleFooter = FooterBase & {
  links: FooterLinkItem[];
};

export type Footer = MultiColumnFooter | SimpleFooter;

export type TableOfContents = {
  minHeadingLevel: number;
  maxHeadingLevel: number;
};

// Theme config after validation/normalization
export type ThemeConfig = {
  docs: {
    versionPersistence: DocsVersionPersistence;
    sidebar: {
      hideable: boolean;
      autoCollapseCategories: boolean;
    };
  };

  blog: {
    sidebar: {
      groupByYear: boolean;
    };
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
  image?: string;
  metadata: {[key: string]: string}[];
  tableOfContents: TableOfContents;
};

// User-provided theme config, unnormalized
export type UserThemeConfig = DeepPartial<ThemeConfig>;

/**
 * A convenient/more semantic way to get theme config from context.
 */
export function useThemeConfig(): ThemeConfig {
  return useDocusaurusContext().siteConfig.themeConfig as ThemeConfig;
}
