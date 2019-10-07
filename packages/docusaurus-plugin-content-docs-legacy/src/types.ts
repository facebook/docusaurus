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

export interface OrderMetadata {
  previous?: string;
  next?: string;
  sidebar?: string;
  category?: string;
  subCategory?: string;
}

export interface Order {
  [id: string]: OrderMetadata;
}

export interface MetadataRaw extends OrderMetadata {
  id: string;
  title: string;
  description: string;
  source: string;
  permalink: string;
}

export interface Metadata extends MetadataRaw {
  previous_title?: string;
  next_title?: string;
}

export interface DocsMetadata {
  [id: string]: Metadata;
}

export interface SourceToPermalink {
  [source: string]: string;
}

export interface PermalinkToId {
  [permalink: string]: string;
}

export interface LoadedContent {
  docs: DocsMetadata;
  docsDir: string;
  docsSidebars: Sidebar;
  sourceToPermalink: SourceToPermalink;
  permalinkToId: PermalinkToId;
}
