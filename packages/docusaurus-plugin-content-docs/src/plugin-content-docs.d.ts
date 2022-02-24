/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-content-docs' {
  import type {RemarkAndRehypePluginOptions} from '@docusaurus/mdx-loader';

  export interface Assets {
    image?: string;
  }

  export type NumberPrefixParser = (filename: string) => {
    filename: string;
    numberPrefix?: number;
  };

  export type CategoryIndexMatcherParam = {
    fileName: string;
    directories: string[];
    extension: string;
  };
  export type CategoryIndexMatcher = (
    param: CategoryIndexMatcherParam,
  ) => boolean;

  export type EditUrlFunction = (editUrlParams: {
    version: string;
    versionDocsDirPath: string;
    docPath: string;
    permalink: string;
    locale: string;
  }) => string | undefined;

  export type MetadataOptions = {
    routeBasePath: string;
    editUrl?: string | EditUrlFunction;
    editCurrentVersion: boolean;
    editLocalizedFiles: boolean;
    showLastUpdateTime?: boolean;
    showLastUpdateAuthor?: boolean;
    numberPrefixParser: NumberPrefixParser;
    breadcrumbs: boolean;
  };

  export type PathOptions = {
    path: string;
    sidebarPath?: string | false | undefined;
  };

  // TODO support custom version banner?
  // {type: "error", content: "html content"}
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
      docCategoryGeneratedIndexComponent: string;
      admonitions: Record<string, unknown>;
      disableVersioning: boolean;
      includeCurrentVersion: boolean;
      sidebarItemsGenerator: import('./sidebars/types').SidebarItemsGeneratorOption;
      tagsBasePath: string;
    };
  export type Options = Partial<PluginOptions>;
  export type SidebarsConfig = import('./sidebars/types').SidebarsConfig;

  export type PropNavigationLink = {
    readonly title: string;
    readonly permalink: string;
  };
  export type PropNavigation = {
    readonly previous?: PropNavigationLink;
    readonly next?: PropNavigationLink;
  };

  export type PropVersionDoc = import('./sidebars/types').PropVersionDoc;
  export type PropVersionDocs = import('./sidebars/types').PropVersionDocs;

  export type PropVersionMetadata = {
    pluginId: string;
    version: string;
    label: string;
    banner: VersionBanner | null;
    badge: boolean;
    className: string;
    isLast: boolean;
    docsSidebars: PropSidebars;
    docs: PropVersionDocs;
  };

  export type PropCategoryGeneratedIndex = {
    title: string;
    description?: string;
    image?: string;
    keywords?: string | readonly string[];
    slug: string;
    permalink: string;
    navigation: PropNavigation;
  };

  export type PropSidebarItemLink =
    import('./sidebars/types').PropSidebarItemLink;
  export type PropSidebarItemCategory =
    import('./sidebars/types').PropSidebarItemCategory;
  export type PropSidebarItem = import('./sidebars/types').PropSidebarItem;
  export type PropSidebarBreadcrumbsItem =
    import('./sidebars/types').PropSidebarBreadcrumbsItem;
  export type PropSidebar = import('./sidebars/types').PropSidebar;
  export type PropSidebars = import('./sidebars/types').PropSidebars;

  export type PropTagDocListDoc = {
    id: string;
    title: string;
    description: string;
    permalink: string;
  };
  export type PropTagDocList = {
    allTagsPath: string;
    name: string; // normalized name/label of the tag
    permalink: string; // pathname of the tag
    docs: PropTagDocListDoc[];
  };

  export type PropTagsListPage = {
    tags: {
      name: string;
      permalink: string;
      count: number;
    }[];
  };
}

declare module '@theme/DocItem' {
  import type {TOCItem} from '@docusaurus/types';
  import type {
    PropNavigationLink,
    PropVersionMetadata,
    Assets,
  } from '@docusaurus/plugin-content-docs';

  export type DocumentRoute = {
    readonly component: () => JSX.Element;
    readonly exact: boolean;
    readonly path: string;
    readonly sidebar?: string;
  };

  export type FrontMatter = {
    readonly id: string;
    readonly title: string;
    readonly image?: string;
    readonly keywords?: readonly string[];
    readonly hide_title?: boolean;
    readonly hide_table_of_contents?: boolean;
    readonly toc_min_heading_level?: number;
    readonly toc_max_heading_level?: number;
  };

  export type Metadata = {
    readonly description?: string;
    readonly title?: string;
    readonly permalink?: string;
    readonly editUrl?: string;
    readonly lastUpdatedAt?: number;
    readonly formattedLastUpdatedAt?: string;
    readonly lastUpdatedBy?: string;
    readonly version?: string;
    readonly previous?: PropNavigationLink;
    readonly next?: PropNavigationLink;
    readonly tags: readonly {
      readonly label: string;
      readonly permalink: string;
    }[];
  };

  export interface Props {
    readonly route: DocumentRoute;
    readonly versionMetadata: PropVersionMetadata;
    readonly content: {
      readonly frontMatter: FrontMatter;
      readonly metadata: Metadata;
      readonly toc: readonly TOCItem[];
      readonly contentTitle: string | undefined;
      readonly assets: Assets;
      (): JSX.Element;
    };
  }

  export default function DocItem(props: Props): JSX.Element;
}

declare module '@theme/DocCategoryGeneratedIndexPage' {
  import type {PropCategoryGeneratedIndex} from '@docusaurus/plugin-content-docs';

  export interface Props {
    readonly categoryGeneratedIndex: PropCategoryGeneratedIndex;
  }

  export default function DocCategoryGeneratedIndexPage(
    props: Props,
  ): JSX.Element;
}

declare module '@theme/DocTagsListPage' {
  import type {PropTagsListPage} from '@docusaurus/plugin-content-docs';

  export interface Props extends PropTagsListPage {}
  export default function DocTagsListPage(props: Props): JSX.Element;
}

declare module '@theme/DocTagDocListPage' {
  import type {PropTagDocList} from '@docusaurus/plugin-content-docs';

  export interface Props {
    readonly tag: PropTagDocList;
  }
  export default function DocTagDocListPage(props: Props): JSX.Element;
}

declare module '@theme/DocBreadcrumbs' {
  export default function DocBreadcrumbs(): JSX.Element;
}

declare module '@theme/DocPage' {
  import type {PropVersionMetadata} from '@docusaurus/plugin-content-docs';
  import type {DocumentRoute} from '@theme/DocItem';

  export interface Props {
    readonly location: {readonly pathname: string};
    readonly versionMetadata: PropVersionMetadata;
    readonly route: {
      readonly path: string;
      readonly component: () => JSX.Element;
      readonly routes: DocumentRoute[];
    };
  }

  export default function DocPage(props: Props): JSX.Element;
}

// TODO until TS supports exports field... hope it's in 4.6
declare module '@docusaurus/plugin-content-docs/client' {
  export type ActivePlugin = {
    pluginId: string;
    pluginData: GlobalPluginData;
  };
  export type ActiveDocContext = {
    activeVersion?: GlobalVersion;
    activeDoc?: GlobalDoc;
    alternateDocVersions: Record<string, GlobalDoc>;
  };
  export type GlobalDoc = {
    id: string;
    path: string;
    sidebar: string | undefined;
  };

  export type GlobalVersion = {
    name: string;
    label: string;
    isLast: boolean;
    path: string;
    mainDocId: string; // home doc (if docs homepage configured), or first doc
    docs: GlobalDoc[];
    sidebars?: Record<string, GlobalSidebar>;
  };

  export type GlobalSidebarLink = {
    label: string;
    path: string;
  };

  export type GlobalSidebar = {
    link?: GlobalSidebarLink;
    // ... we may add other things here later
  };
  export type GlobalPluginData = {
    path: string;
    versions: GlobalVersion[];
    breadcrumbs: boolean;
  };
  export type DocVersionSuggestions = {
    // suggest the latest version
    latestVersionSuggestion: GlobalVersion;
    // suggest the same doc, in latest version (if exist)
    latestDocSuggestion?: GlobalDoc;
  };
  export type GetActivePluginOptions = {failfast?: boolean}; // use fail-fast option if you know for sure one plugin instance is active

  export const useAllDocsData: () => Record<string, GlobalPluginData>;
  export const useDocsData: (pluginId?: string) => GlobalPluginData;
  export const useActivePlugin: (
    options?: GetActivePluginOptions,
  ) => ActivePlugin | undefined;
  export const useActivePluginAndVersion: (
    options?: GetActivePluginOptions,
  ) =>
    | {activePlugin: ActivePlugin; activeVersion: GlobalVersion | undefined}
    | undefined;
  export const useVersions: (pluginId?: string) => GlobalVersion[];
  export const useLatestVersion: (pluginId?: string) => GlobalVersion;
  export const useActiveVersion: (
    pluginId?: string,
  ) => GlobalVersion | undefined;
  export const useActiveDocContext: (pluginId?: string) => ActiveDocContext;
  export const useDocVersionSuggestions: (
    pluginId?: string,
  ) => DocVersionSuggestions;
}
