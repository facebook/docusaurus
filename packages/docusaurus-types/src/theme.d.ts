/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {PrismTheme} from 'prism-react-renderer';

export type ColorMode = 'light' | 'dark';
type NavbarStyle = 'primary' | 'dark';
type FooterStyle = 'dark' | 'light';
type NavbarPosition = 'left' | 'right';
type VersionPersistence = 'localStorage' | 'none';

// ============================================================================
// Color Mode Configuration
// ============================================================================

interface ColorModeConfig {
  /** The color mode when user first visits the site */
  defaultMode?: ColorMode;
  /** Hides the switch in the navbar. Useful if you want to support a single color mode */
  disableSwitch?: boolean;
  /** Whether to use the prefers-color-scheme media-query, using user system preferences */
  respectPrefersColorScheme?: boolean;
}

// ============================================================================
// Metadata Configuration
// ============================================================================

interface MetadataItem {
  id?: string;
  name?: string;
  property?: string;
  content?: string;
  itemprop?: string;
  [key: string]: string | undefined;
}

// ============================================================================
// Announcement Bar Configuration
// ============================================================================

interface AnnouncementBarConfig {
  /** Any value that will identify this message */
  id?: string;
  /** The text content of the announcement. HTML will be interpolated */
  content: string;
  /** Background color of the entire bar */
  backgroundColor?: string;
  /** Announcement text color */
  textColor?: string;
  /** Whether this announcement can be dismissed with a '×' button */
  isCloseable?: boolean;
}

// ============================================================================
// Navbar Configuration
// ============================================================================

interface NavbarLogo {
  /** Alt tag for the logo image */
  alt?: string;
  /** URL to the logo image. Base URL is appended by default */
  src: string;
  /** An alternative image URL to use in dark mode */
  srcDark?: string;
  /** Link to navigate to when the logo is clicked */
  href?: string;
  /** Specifies the width attribute */
  width?: string | number;
  /** Specifies the height attribute */
  height?: string | number;
  /** The target attribute of the link */
  target?: string;
  /** CSS class applied to the image */
  className?: string;
  /** CSS inline style object. React/JSX flavor, using camelCase properties */
  style?: React.CSSProperties;
}

export interface NavbarLinkItem {
  type?: 'default';
  /** The name to be shown for this item */
  label?: string;
  /** Same as label, but renders pure HTML instead of text content */
  html?: string;
  /** Client-side routing, used for navigating within the website */
  to?: string;
  /** A full-page navigation, used for navigating outside of the website */
  href?: string;
  /** Prepends the baseUrl to href values */
  prependBaseUrlToHref?: boolean;
  /** The side of the navbar this item should appear on */
  position?: NavbarPosition;
  /** To apply the active class styling on all routes starting with this path */
  activeBasePath?: string;
  /** Alternative to activeBasePath if required */
  activeBaseRegex?: string;
  /** Custom CSS class (for styling any item) */
  className?: string;
  /** The target attribute of the link */
  target?: string;
  /** Accessibility label */
  'aria-label'?: string;
  [key: string]: unknown;
}

export interface NavbarDocLinkItem {
  type: 'doc';
  /** The ID of the doc that this item links to */
  docId: string;
  /** The name to be shown for this item */
  label?: string;
  /** The side of the navbar this item should appear on */
  position?: NavbarPosition;
  /** The ID of the docs plugin that the doc belongs to */
  docsPluginId?: string;
}

export interface NavbarDocSidebarItem {
  type: 'docSidebar';
  /** The ID of the sidebar that this item is linked to */
  sidebarId: string;
  /** The name to be shown for this item */
  label?: string;
  /** The side of the navbar this item should appear on */
  position?: NavbarPosition;
  /** The ID of the docs plugin that the sidebar belongs to */
  docsPluginId?: string;
}

export interface NavbarDropdownItem {
  type: 'dropdown';
  /** The name to be shown for this item */
  label: string;
  /** The items to be contained in the dropdown */
  items: NavbarItem[];
  /** The side of the navbar this item should appear on */
  position?: NavbarPosition;
}

interface DropdownVersion {
  /** Allows you to provide a custom display label for each version */
  label?: string;
}

type DropdownVersions = string[] | Record<string, DropdownVersion>;

export interface NavbarDocsVersionDropdownItem {
  type: 'docsVersionDropdown';
  /** The side of the navbar this item should appear on */
  position?: NavbarPosition;
  /** Add additional dropdown items at the beginning of the dropdown */
  dropdownItemsBefore?: NavbarItem[];
  /** Add additional dropdown items at the end of the dropdown */
  dropdownItemsAfter?: NavbarItem[];
  /** The ID of the docs plugin that the doc versioning belongs to */
  docsPluginId?: string;
  /** Do not add the link active class when browsing docs */
  dropdownActiveClassDisabled?: boolean;
  /** Specify a custom list of versions to include in the dropdown */
  versions?: DropdownVersions;
}

export interface NavbarDocsVersionItem {
  type: 'docsVersion';
  /** The name to be shown for this item */
  label?: string;
  /** The internal link that this item points to */
  to?: string;
  /** The side of the navbar this item should appear on */
  position?: NavbarPosition;
  /** The ID of the docs plugin that the doc versioning belongs to */
  docsPluginId?: string;
}

export interface NavbarLocaleDropdownItem {
  type: 'localeDropdown';
  /** The side of the navbar this item should appear on */
  position?: NavbarPosition;
  /** Add additional dropdown items at the beginning of the dropdown */
  dropdownItemsBefore?: NavbarItem[];
  /** Add additional dropdown items at the end of the dropdown */
  dropdownItemsAfter?: NavbarItem[];
  /** The query string to be appended to the URL */
  queryString?: string;
}

export interface NavbarSearchItem {
  type: 'search';
  /** The side of the navbar this item should appear on */
  position?: NavbarPosition;
  /** Custom CSS class for this navbar item */
  className?: string;
}

export interface NavbarHtmlItem {
  type: 'html';
  /** The side of the navbar this item should appear on */
  position?: NavbarPosition;
  /** Custom CSS class for this navbar item */
  className?: string;
  /** Custom HTML to be rendered inside this navbar item */
  value: string;
}

export type NavbarItem =
  | NavbarLinkItem
  | NavbarDocLinkItem
  | NavbarDocSidebarItem
  | NavbarDropdownItem
  | NavbarDocsVersionDropdownItem
  | NavbarDocsVersionItem
  | NavbarLocaleDropdownItem
  | NavbarSearchItem
  | NavbarHtmlItem;

interface NavbarConfig {
  /** Title for the navbar */
  title?: string;
  /** Customization of the logo object */
  logo?: NavbarLogo;
  /** A list of navbar items */
  items?: NavbarItem[];
  /** Whether the navbar is hidden when the user scrolls down */
  hideOnScroll?: boolean;
  /** Sets the navbar style, ignoring the dark/light theme */
  style?: NavbarStyle;
}

// ============================================================================
// Footer Configuration
// ============================================================================

export interface FooterLinkItem {
  /** Text to be displayed for this link */
  label?: string;
  /** Client-side routing, used for navigating within the website */
  to?: string;
  /** A full-page navigation, used for navigating outside of the website */
  href?: string;
  /** Renders the HTML pass-through instead of a simple link */
  html?: string;
}

export interface FooterColumnLinkItem {
  /** Label of the section of these links */
  title?: string;
  /** Links in this section */
  items: FooterLinkItem[];
}

interface FooterConfig {
  /** Customization of the logo object */
  logo?: NavbarLogo;
  /** The copyright message to be displayed at the bottom, also supports custom HTML */
  copyright?: string;
  /** The color theme of the footer component */
  style?: FooterStyle;
  /** The link groups to be present */
  links?: FooterLinkItem[] | FooterColumnLinkItem[];
}

// ============================================================================
// Code Block Configuration
// ============================================================================

export interface MagicCommentConfig {
  className: string;
  line?: string;
  block?: {
    start: string;
    end: string;
  };
}

interface PrismConfig {
  /** The Prism theme to use for light-theme code blocks */
  theme?: PrismTheme;
  /** The Prism theme to use for dark-theme code blocks */
  darkTheme?: PrismTheme;
  /** The default language to use for code blocks not declaring any explicit language */
  defaultLanguage?: string;
  /** Additional languages to use for code blocks */
  additionalLanguages?: string[];
  /** The list of magic comments */
  magicComments?: MagicCommentConfig[];
}

// ============================================================================
// Table of Contents Configuration
// ============================================================================

interface TableOfContentsConfig {
  /** The minimum heading level shown in the table of contents. Must be between 2 and 6 */
  minHeadingLevel?: number;
  /** Max heading level displayed in the TOC. Should be an integer between 2 and 6 */
  maxHeadingLevel?: number;
}

// ============================================================================
// Docs Plugin Configuration
// ============================================================================

interface DocsSidebarConfig {
  /** Show a hide button at the bottom of the sidebar */
  hideable?: boolean;
  /** Automatically collapse all sibling categories of the one you navigate to */
  autoCollapseCategories?: boolean;
}

interface DocsConfig {
  /** Defines the browser persistence of the preferred docs version */
  versionPersistence?: VersionPersistence;
  /** Sidebar configuration */
  sidebar?: DocsSidebarConfig;
}

// ============================================================================
// Blog Plugin Configuration
// ============================================================================

interface BlogSidebarConfig {
  /** Group sidebar blog posts by years */
  groupByYear?: boolean;
}

interface BlogConfig {
  /** Sidebar configuration */
  sidebar?: BlogSidebarConfig;
}

// ============================================================================
// Main Theme Configuration Interface
// ============================================================================

export interface ThemeConfig {
  /** Color mode configuration */
  colorMode?: ColorModeConfig;
  /** The meta image URL for the site */
  image?: string;
  /** Additional HTML metadata */
  metadata?: MetadataItem[];
  /** Announcement bar configuration */
  announcementBar?: AnnouncementBarConfig;
  /** Navbar configuration */
  navbar?: NavbarConfig;
  /** Footer configuration */
  footer?: FooterConfig;
  /** Code block (Prism) configuration */
  prism?: PrismConfig;
  /** Table of contents configuration */
  tableOfContents?: TableOfContentsConfig;
  /** Docs plugin theme configuration */
  docs?: DocsConfig;
  /** Blog plugin theme configuration */
  blog?: BlogConfig;
}
