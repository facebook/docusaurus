/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/// <reference types="@docusaurus/module-type-aliases" />

import type {RemarkAndRehypePluginOptions} from '@docusaurus/mdx-loader';
import type {Tag, FrontMatterTag} from '@docusaurus/utils';
import type {
  BrokenMarkdownLink as IBrokenMarkdownLink,
  ContentPaths,
} from '@docusaurus/utils/lib/markdownLinks';
import type {SidebarItemsGeneratorOption, Sidebars} from './sidebars/types';

export type DocFile = {
  contentPath: string; // /!\ may be localized
  filePath: string; // /!\ may be localized
  source: string;
  content: string;
  lastUpdate: LastUpdateData;
};

export type VersionName = string;

export type VersionMetadata = ContentPaths & {
  versionName: VersionName; // 1.0.0
  versionLabel: string; // Version 1.0.0
  versionPath: string; // /baseUrl/docs/1.0.0
  tagsPath: string;
  versionEditUrl?: string | undefined;
  versionEditUrlLocalized?: string | undefined;
  versionBanner: VersionBanner | null;
  versionBadge: boolean;
  versionClassName: string;
  isLast: boolean;
  sidebarFilePath: string | false | undefined; // versioned_sidebars/1.0.0.json
  routePriority: number | undefined; // -1 for the latest docs
};

export type EditUrlFunction = (editUrlParams: {
  version: string;
  versionDocsDirPath: string;
  docPath: string;
  permalink: string;
  locale: string;
}) => string | undefined;

export type MetadataOptions = {
  routeBasePath: string;
  homePageId?: string;
  editUrl?: string | EditUrlFunction;
  editCurrentVersion: boolean;
  editLocalizedFiles: boolean;
  showLastUpdateTime?: boolean;
  showLastUpdateAuthor?: boolean;
  numberPrefixParser: NumberPrefixParser;
};

export type PathOptions = {
  path: string;
  sidebarPath?: string | false | undefined;
};

// TODO support custom version banner? {type: "error", content: "html content"}
export type VersionBanner = 'unreleased' | 'unmaintained';

export type VersionOptions = {
  path?: string;
  label?: string;
  banner?: 'none' | VersionBanner;
  badge?: boolean;
  className?: string;
};

export type VersionsOptions = {
  lastVersion?: string;
  versions: Record<string, VersionOptions>;
  onlyIncludeVersions?: string[];
};

export type SidebarOptions = {
  sidebarCollapsible: boolean;
  sidebarCollapsed: boolean;
};

export type PluginOptions = MetadataOptions &
  PathOptions &
  VersionsOptions &
  RemarkAndRehypePluginOptions &
  SidebarOptions & {
    id: string;
    include: string[];
    exclude: string[];
    docLayoutComponent: string;
    docItemComponent: string;
    docTagDocListComponent: string;
    docTagsListComponent: string;
    admonitions: Record<string, unknown>;
    disableVersioning: boolean;
    includeCurrentVersion: boolean;
    sidebarItemsGenerator: SidebarItemsGeneratorOption;
    tagsBasePath: string;
  };

export type LastUpdateData = {
  lastUpdatedAt?: number;
  formattedLastUpdatedAt?: string;
  lastUpdatedBy?: string;
};

export type DocFrontMatter = {
  // Front matter uses snake case
  /* eslint-disable camelcase */
  id?: string;
  title?: string;
  tags?: FrontMatterTag[];
  hide_title?: boolean;
  hide_table_of_contents?: boolean;
  keywords?: string[];
  image?: string;
  description?: string;
  slug?: string;
  sidebar_label?: string;
  sidebar_position?: number;
  sidebar_class_name?: string;
  pagination_label?: string;
  custom_edit_url?: string | null;
  parse_number_prefixes?: boolean;
  toc_min_heading_level?: number;
  toc_max_heading_level?: number;
  pagination_next?: string | null;
  pagination_prev?: string | null;
  /* eslint-enable camelcase */
};

export type DocMetadataBase = LastUpdateData & {
  version: VersionName;
  unversionedId: string;
  id: string;
  isDocsHomePage: boolean;
  title: string;
  description: string;
  source: string;
  sourceDirName: string; // relative to the docs folder (can be ".")
  slug: string;
  permalink: string;
  sidebarPosition?: number;
  editUrl?: string | null;
  tags: Tag[];
  frontMatter: DocFrontMatter & Record<string, unknown>;
};

export type DocNavLink = {
  title: string;
  permalink: string;
};

export type DocMetadata = DocMetadataBase & {
  sidebar?: string;
  previous?: DocNavLink;
  next?: DocNavLink;
};

export type SourceToPermalink = {
  [source: string]: string;
};

export type VersionTag = {
  name: string; // normalized name/label of the tag
  docIds: string[]; // all doc ids having this tag
  permalink: string; // pathname of the tag
};
export type VersionTags = {
  [key: string]: VersionTag;
};

export type LoadedVersion = VersionMetadata & {
  versionPath: string;
  mainDocId: string;
  docs: DocMetadata[];
  sidebars: Sidebars;
};

export type LoadedContent = {
  loadedVersions: LoadedVersion[];
};

export type GlobalDoc = {
  id: string;
  path: string;
  sidebar: string | undefined;
};

export type GlobalVersion = {
  name: VersionName;
  label: string;
  isLast: boolean;
  path: string;
  mainDocId: string; // home doc (if docs homepage configured), or first doc
  docs: GlobalDoc[];
};

export type GlobalPluginData = {
  path: string;
  versions: GlobalVersion[];
};

export type BrokenMarkdownLink = IBrokenMarkdownLink<VersionMetadata>;

export type DocsMarkdownOption = {
  versionsMetadata: VersionMetadata[];
  siteDir: string;
  sourceToPermalink: SourceToPermalink;
  onBrokenMarkdownLink: (brokenMarkdownLink: BrokenMarkdownLink) => void;
};

export type NumberPrefixParser = (filename: string) => {
  filename: string;
  numberPrefix?: number;
};
