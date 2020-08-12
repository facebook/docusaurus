/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// eslint-disable-next-line spaced-comment
/// <reference types="@docusaurus/module-type-aliases" />

export type VersionName = string;

export type VersionMetadata = {
  versionName: VersionName;
  docsPath: string;
  sidebarPath: string;
};

export interface MetadataOptions {
  routeBasePath: string;
  homePageId?: string;
  editUrl?: string;
  showLastUpdateTime?: boolean;
  showLastUpdateAuthor?: boolean;
}

export interface PathOptions {
  path: string;
  sidebarPath: string;
}

export interface PluginOptions extends MetadataOptions, PathOptions {
  id: string;
  include: string[];
  docLayoutComponent: string;
  docItemComponent: string;
  remarkPlugins: ([Function, object] | Function)[];
  rehypePlugins: string[];
  admonitions: any;
  disableVersioning: boolean;
  excludeNextVersionDocs?: boolean;
  includeCurrentVersion: boolean;
}

export type SidebarItemDoc = {
  type: 'doc' | 'ref';
  id: string;
};

export interface SidebarItemLink {
  type: 'link';
  href: string;
  label: string;
}

export interface SidebarItemCategory {
  type: 'category';
  label: string;
  items: SidebarItem[];
  collapsed: boolean;
}

export interface SidebarItemCategoryRaw {
  type: 'category';
  label: string;
  items: SidebarItemRaw[];
  collapsed?: boolean;
}

export type SidebarItem =
  | SidebarItemDoc
  | SidebarItemLink
  | SidebarItemCategory;

export type SidebarItemRaw =
  | string
  | SidebarCategoryShorthandRaw
  | SidebarItemDoc
  | SidebarItemLink
  | SidebarItemCategoryRaw
  | {
      type: string;
      [key: string]: unknown;
    };

export interface SidebarCategoryShorthandRaw {
  [sidebarCategory: string]: SidebarItemRaw[];
}

export interface Sidebars {
  [sidebarId: string]: SidebarItem[];
}

export interface OrderMetadata {
  previous?: string;
  next?: string;
  sidebar?: string;
}

export interface Order {
  [id: string]: OrderMetadata;
}

export interface LastUpdateData {
  lastUpdatedAt?: number;
  lastUpdatedBy?: string;
}

export interface DocMetadataBase extends LastUpdateData {
  version: VersionName;
  unversionedId: string;
  id: string;
  isDocsHomePage: boolean;
  title: string;
  description: string;
  source: string;
  slug: string;
  permalink: string;
  sidebar_label?: string;
  editUrl?: string | null;
}

export interface DocNavLink {
  title: string;
  permalink: string;
}

export interface DocMetadata extends DocMetadataBase {
  sidebar?: string;
  previous?: DocNavLink;
  next?: DocNavLink;
}

export interface DocsMetadataRaw {
  [id: string]: DocMetadataBase;
}

export interface SourceToPermalink {
  [source: string]: string;
}

export interface PermalinkToSidebar {
  [permalink: string]: string;
}

export type LoadedVersion = VersionMetadata & {
  versionPath: string;
  mainDocId: string;
  docs: DocMetadata[];
  sidebars: Sidebars;
  permalinkToSidebar: Record<string, string>;
};

export interface LoadedContent {
  loadedVersions: LoadedVersion[];
}

export type VersioningEnv = {
  enabled: boolean;
  latestVersion: string;
  versions: string[];
  docsDir: string;
  sidebarsDir: string;
};

export interface Env {
  versioning: VersioningEnv;
  // TODO: translation
}

export type GlobalDoc = {
  id: string;
  path: string;
};

export type GlobalVersion = {
  name: VersionName;
  path: string;
  mainDocId: string; // home doc (if docs homepage configured), or first doc
  docs: GlobalDoc[];
};

export type GlobalPluginData = {
  path: string;
  latestVersionName: VersionName;
  versions: GlobalVersion[];
};

export type PropVersionMetadata = {
  version: VersionName;
  docsSidebars: PropSidebars;
  permalinkToSidebar: PermalinkToSidebar;
};

export type PropSidebarItemLink = SidebarItemLink; // same

export interface PropSidebarItemCategory {
  type: 'category';
  label: string;
  items: PropSidebarItemLink[];
  collapsed?: boolean;
}

export type PropSidebarItem = PropSidebarItemLink | PropSidebarItemCategory;

export interface PropSidebars {
  [sidebarId: string]: PropSidebarItem[];
}
