/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface PluginOptions {
  path: string;
  routeBasePath: string;
  include: string[];
  sidebarPath: string;
  docLayoutComponent: string;
  docItemComponent: string;
  remarkPlugins: string[];
  rehypePlugins: string[];
  editUrl?: string;
  showLastUpdateTime?: boolean;
  showLastUpdateAuthor?: boolean;
}

export type SidebarItemDoc = {
  type: string;
  id: string;
};

export interface SidebarItemLink {
  type: string;
  href: string;
  label: string;
}

export interface SidebarItemCategory {
  type: string;
  label: string;
  items: SidebarItem[];
}

export interface SidebarItemCategoryRaw {
  type: string;
  label: string;
  items: SidebarItemRaw[];
}

export type SidebarItem =
  | SidebarItemDoc
  | SidebarItemLink
  | SidebarItemCategory;

export type SidebarItemRaw =
  | string
  | SidebarItemDoc
  | SidebarItemLink
  | SidebarItemCategoryRaw;

// Sidebar given by user that is not normalized yet. e.g: sidebars.json
export interface SidebarRaw {
  [sidebarId: string]: {
    [sidebarCategory: string]: SidebarItemRaw[];
  };
}

export interface Sidebar {
  [sidebarId: string]: SidebarItemCategory[];
}

export interface DocsSidebarItemCategory {
  type: string;
  label: string;
  items: (SidebarItemLink | DocsSidebarItemCategory)[];
}

export interface DocsSidebar {
  [sidebarId: string]: DocsSidebarItemCategory[];
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
  hide_title?: boolean;
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

export interface SourceToPermalink {
  [source: string]: string;
}

export interface PermalinkToSidebar {
  [permalink: string]: string;
}

export interface LoadedContent {
  docsMetadata: DocsMetadata;
  docsDir: string;
  docsSidebars: Sidebar;
  sourceToPermalink: SourceToPermalink;
  permalinkToSidebar: PermalinkToSidebar;
}

export type DocsBaseMetadata = Pick<
  LoadedContent,
  'docsSidebars' | 'permalinkToSidebar'
>;

export type VersioningEnv = {
  enabled: boolean;
  latestVersion: string | null;
  versions: string[];
  docsDir: string;
  sidebarsDir: string;
};

export type Env = {
  versioning: VersioningEnv;
};
