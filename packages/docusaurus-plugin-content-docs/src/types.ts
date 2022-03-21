/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/// <reference types="@docusaurus/module-type-aliases" />

import type {Sidebars} from './sidebars/types';
import type {Tag, FrontMatterTag} from '@docusaurus/utils';
import type {
  BrokenMarkdownLink as IBrokenMarkdownLink,
  ContentPaths,
} from '@docusaurus/utils/lib/markdownLinks';
import type {VersionBanner} from '@docusaurus/plugin-content-docs';

export type DocFile = {
  contentPath: string; // /!\ may be localized
  filePath: string; // /!\ may be localized
  source: string;
  content: string;
  lastUpdate: LastUpdateData;
};

export type VersionMetadata = ContentPaths & {
  versionName: string; // 1.0.0
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

export type LastUpdateData = {
  lastUpdatedAt?: number;
  formattedLastUpdatedAt?: string;
  lastUpdatedBy?: string;
};

export type DocFrontMatter = {
  // Front matter uses snake case
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
  sidebar_custom_props?: Record<string, unknown>;
  displayed_sidebar?: string | null;
  pagination_label?: string;
  custom_edit_url?: string | null;
  parse_number_prefixes?: boolean;
  toc_min_heading_level?: number;
  toc_max_heading_level?: number;
  pagination_next?: string | null;
  pagination_prev?: string | null;
};

export type DocMetadataBase = LastUpdateData & {
  id: string; // TODO legacy versioned id => try to remove
  unversionedId: string; // TODO new unversioned id => try to rename to "id"
  version: string;
  title: string;
  description: string;
  source: string; // @site aliased posix source => "@site/docs/folder/subFolder/subSubFolder/myDoc.md"
  sourceDirName: string; // posix path relative to the versioned docs folder (can be ".") => "folder/subFolder/subSubFolder"
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

export type CategoryGeneratedIndexMetadata = {
  title: string;
  description?: string;
  slug: string;
  permalink: string;
  sidebar: string;
  previous?: DocNavLink;
  next?: DocNavLink;
  image?: string;
  keywords?: string | readonly string[];
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
  categoryGeneratedIndices: CategoryGeneratedIndexMetadata[];
};

export type LoadedContent = {
  loadedVersions: LoadedVersion[];
};

export type BrokenMarkdownLink = IBrokenMarkdownLink<VersionMetadata>;

export type DocsMarkdownOption = {
  versionsMetadata: VersionMetadata[];
  siteDir: string;
  sourceToPermalink: SourceToPermalink;
  onBrokenMarkdownLink: (brokenMarkdownLink: BrokenMarkdownLink) => void;
};
