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
export interface VersionTwoConfig {
  baseUrl: string;
  favicon: string;
  tagline?: string;
  title: string;
  url: string;
  organizationName?: string;
  projectName?: string;
  githubHost?: string;
  plugins: Array<[string, {[key: string]: any}]>;
  themes?: [];
  presets: [
    [
      string,
      {
        docs: {[key: string]: any};
        blog: {[key: string]: any};
        theme: {[key: string]: any};
      },
    ],
  ];
  themeConfig: {
    navbar: {
      title?: string;
      logo: {
        src?: string;
      };
      image?: string;
      links: Array<object>;
    };
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
    algolia?: object;
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
  noIndex?: string;
  headerLinks?: Array<any>;
  headerIcon?: string;
  favicon?: string;
  colors?: any;
  copyright?: string;
  editUrl?: string;
  users?: Array<object>;
  disableHeaderTitle?: string;
  disableTitleTagline?: string;
  separateCss?: Array<object>;
  footerIcon?: string;
  translationRecruitingLink?: string;
  algolia?: object;
  gaTrackingId?: string;
  highlight?: object;
  markdownPlugins?: Array<() => void>;
  scripts?: Array<{src: string; [key: string]: any} | string>;
  stylesheets?: Array<{href: string; [key: string]: any} | string>;
  facebookAppId?: string;
  facebookComments?: true;
  facebookPixelId?: string;
  twitter?: string;
  twitterUsername?: string;
  twitterImage?: string;
  ogImage?: string;
  cleanUrl?: boolean;
  scrollToTop?: boolean;
  scrollToTopOptions?: object;
};
