/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type RawData = {
  header?: string;
  content?: string;
};

export type Data = {
  metadata: {[key: string]: string};
  rawContent: string;
};

export type ClassicPresetEntries = {
  docs: {[key: string]: unknown};
  blog: {[key: string]: unknown};
  theme: {[key: string]: unknown};
};

export type SidebarEntry =
  | string
  | {
      type: string;
      label: string;
      ids: string[];
    };

export type SidebarEntries = {
  [key: string]:
    | Record<string, unknown>
    | Array<Record<string, unknown> | string>;
};

export interface VersionTwoConfig {
  baseUrl: string;
  favicon: string;
  tagline?: string;
  title: string;
  url: string;
  organizationName?: string;
  projectName?: string;
  noIndex?: boolean;
  githubHost?: string;
  onBrokenLinks: string;
  onBrokenMarkdownLinks: string;
  plugins: Array<[string, {[key: string]: unknown}]>;
  themes?: [];
  presets: [[string, ClassicPresetEntries]];
  themeConfig: {
    gtag?: {
      trackingID?: string;
    };
    navbar: {
      title?: string;
      logo?: {
        src?: string;
      };
      items: Array<Record<string, unknown> | null>;
    };
    image?: string;
    footer: {
      links: Array<{
        title: string;
        items: Array<{
          label: string;
          to: string;
        }>;
      }>;
      copyright?: string;
      logo: {
        src?: string;
      };
    };
    algolia?: Record<string, unknown>;
  };
  customFields: {
    [key: string]: unknown;
  };
  scripts?: (
    | string
    | {
        src: string;
        [key: string]: unknown;
      }
  )[];
  stylesheets?: (
    | string
    | {
        href: string;
        [key: string]: unknown;
      }
  )[];
}

export type VersionOneConfig = {
  title?: string;
  tagline?: string;
  url?: string;
  baseUrl?: string;
  defaultVersionShown?: string;
  organizationName?: string;
  projectName?: string;
  noIndex?: boolean;
  headerLinks?: Array<{doc: string; href: string; label: string; page: string}>;
  headerIcon?: string;
  favicon?: string;
  colors?: {primaryColor: string};
  copyright?: string;
  editUrl?: string;
  customDocsPath?: string;
  users?: Array<Record<string, unknown>>;
  disableHeaderTitle?: string;
  disableTitleTagline?: string;
  separateCss?: Array<Record<string, unknown>>;
  footerIcon?: string;
  translationRecruitingLink?: string;
  algolia?: Record<string, unknown>;
  gaTrackingId?: string;
  highlight?: Record<string, unknown>;
  markdownPlugins?: Array<() => void>;
  scripts?: Array<{src: string; [key: string]: unknown} | string>;
  stylesheets?: Array<{href: string; [key: string]: unknown} | string>;
  facebookAppId?: string;
  facebookComments?: true;
  facebookPixelId?: string;
  twitter?: string;
  twitterUsername?: string;
  twitterImage?: string;
  ogImage?: string;
  cleanUrl?: boolean;
  scrollToTop?: boolean;
  scrollToTopOptions?: Record<string, unknown>;
};
