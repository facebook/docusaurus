/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface MetadataOptions {
  routeBasePath: string;
  editUrl?: string;
  showLastUpdateTime?: boolean;
  showLastUpdateAuthor?: boolean;
}

export interface PathOptions {
  path: string;
  sidebarPath: string;
}

export interface PluginOptions extends MetadataOptions, PathOptions {
  include: string[];
  docLayoutComponent: string;
  docItemComponent: string;
  remarkPlugins: string[];
  rehypePlugins: string[];
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
}

export interface SidebarItemCategoryRaw {
  type: 'category';
  label: string;
  items: SidebarItemRaw[];
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
      [key: string]: any;
    };

export interface SidebarCategoryShorthandRaw {
  [sidebarCategory: string]: SidebarItemRaw[];
}

// Sidebar given by user that is not normalized yet. e.g: sidebars.json
export interface SidebarRaw {
  [sidebarId: string]: SidebarCategoryShorthandRaw | SidebarItemRaw[];
}

export interface Sidebar {
  [sidebarId: string]: SidebarItem[];
}

export interface DocsSidebarItemCategory {
  type: 'category';
  label: string;
  items: DocsSidebarItem[];
}

export type DocsSidebarItem = SidebarItemLink | DocsSidebarItemCategory;

export interface DocsSidebar {
  [sidebarId: string]: DocsSidebarItem[];
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

export interface MetadataRaw extends LastUpdateData {
  id: string;
  title: string;
  description: string;
  source: string;
  permalink: string;
  sidebar_label?: string;
  editUrl?: string;
  version?: string;
}

export interface Paginator {
  title: string;
  permalink: string;
}

export interface Metadata extends MetadataRaw {
  sidebar?: string;
  previous?: Paginator;
  next?: Paginator;
}

export interface DocsMetadata {
  [id: string]: Metadata;
}

export interface DocsMetadataRaw {
  [id: string]: MetadataRaw;
}

export interface SourceToPermalink {
  [source: string]: string;
}

export interface PermalinkToSidebar {
  [permalink: string]: string;
}

export interface VersionToSidebars {
  [version: string]: Set<string>;
}

export interface LoadedContent {
  docsMetadata: DocsMetadata;
  docsDir: string;
  docsSidebars: DocsSidebar;
  permalinkToSidebar: PermalinkToSidebar;
  versionToSidebars: VersionToSidebars;
}

export type DocsBaseMetadata = Pick<
  LoadedContent,
  'docsSidebars' | 'permalinkToSidebar'
> & {
  version?: string;
};

export type VersioningEnv = {
  enabled: boolean;
  latestVersion: string | null;
  versions: string[];
  docsDir: string;
  sidebarsDir: string;
};

export interface Env {
  versioning: VersioningEnv;
  // TODO: translation
}
