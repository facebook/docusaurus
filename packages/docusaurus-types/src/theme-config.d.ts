/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type React from 'react';

export type DocsVersionPersistence = 'localStorage' | 'none';

export interface ThemeImage {
  src: string;
  srcDark?: string;
  href?: string;
  target?: string;
  alt?: string;
}

// TODO improve types, use unions
export interface ThemeNavbarItem {
  type?: string | undefined;
  items?: ThemeNavbarItem[];
  label?: string;
  position?: 'left' | 'right';
}

export type ThemeNavbarLogo = ThemeImage;

// TODO improve
export interface ThemeNavbar {
  style: 'dark' | 'primary';
  hideOnScroll: boolean;
  title?: string;
  items: ThemeNavbarItem[];
  logo?: ThemeNavbarLogo;
}

// TODO improve
export interface ThemeFooterLinkItem {
  label?: string;
  to?: string;
  href?: string;
  html?: string;
  prependBaseUrlToHref?: boolean;
}

export interface ThemeFooterLinks {
  title?: string;
  items: ThemeFooterLinkItem[];
}

export type ThemeFooterLogo = ThemeImage;

export interface ThemeFooter {
  style: 'light' | 'dark';
  logo?: ThemeFooterLogo;
  copyright?: string;
  links: ThemeFooterLinks[];
}

export interface ThemeColorMode {
  defaultMode?: 'light' | 'dark';
  /**
   * Hides the switch in the navbar
   * Useful if you want to support a single color mode
   */
  disableSwitch: boolean;
  /**
   * Should we use the prefers-color-scheme media-query,
   * using user system preferences, instead of the hardcoded defaultMode
   */
  respectPrefersColorScheme?: boolean;
  /**
   * Dark/light switch icon options
   */
  switchConfig: {
    /**
     * Icon for the switch while in dark mode
     */
    darkIcon: string;
    /**
     * React inline style object
     * @see https://reactjs.org/docs/dom-elements.html#style
     */
    darkIconStyle: React.CSSProperties;
    /**
     * Icon for the switch while in light mode
     */
    lightIcon: string;
    /**
     * React inline style object
     * @see https://reactjs.org/docs/dom-elements.html#style
     */
    lightIconStyle: React.CSSProperties;
  };
}

export interface ThemeDocs {
  versionPersistence: DocsVersionPersistence;
}

/**
 * The theme configuration object, to customize your site UI like navbar, footer.
 * https://v2.docusaurus.io/docs/next/docusaurus.config.js#themeconfig
 */
export interface ThemeConfig {
  docs: ThemeDocs;
  // TODO we should complete this theme config type over time
  // and share it across all themes
  // and use it in the Joi validation schema?

  // TODO temporary types
  navbar: ThemeNavbar;
  colorMode: ThemeColorMode;
  footer?: ThemeFooter;
  hideableSidebar?: boolean;

  // TODO: validate this
  image?: string;
  announcementBar: any;
  prism: any;
  metadatas: any;
  sidebarCollapsible?: boolean;

  [key: string]: unknown;
}
