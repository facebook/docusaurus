/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-content-docs' {
  export type Options = Partial<import('./types').PluginOptions>;
  export type SidebarsConfig = import('./sidebars/types').SidebarsConfig;
  export type VersionBanner = import('./types').VersionBanner;
  type GlobalDataVersion = import('./types').GlobalVersion;
  type GlobalDataDoc = import('./types').GlobalDoc;
  type VersionTag = import('./types').VersionTag;

  export type {GlobalDataVersion, GlobalDataDoc};

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
    slug: string;
    permalink: string;
    navigation: PropNavigation;
  };

  export type PropSidebarItemLink =
    import('./sidebars/types').PropSidebarItemLink;
  export type PropSidebarItemCategory =
    import('./sidebars/types').PropSidebarItemCategory;
  export type PropSidebarItem = import('./sidebars/types').PropSidebarItem;
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
      (): JSX.Element;
    };
  }

  const DocItem: (props: Props) => JSX.Element;
  export default DocItem;
}

declare module '@theme/DocCard' {
  import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';

  export interface Props {
    readonly item: PropSidebarItem;
  }

  export default function DocCard(props: Props): JSX.Element;
}

declare module '@theme/DocCardList' {
  import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';

  export interface Props {
    readonly items: PropSidebarItem[];
  }

  export default function DocCardList(props: Props): JSX.Element;
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

declare module '@theme/DocItemFooter' {
  import type {Props} from '@theme/DocItem';

  export default function DocItemFooter(props: Props): JSX.Element;
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

declare module '@theme/DocVersionBanner' {
  export interface Props {
    readonly className?: string;
  }

  export default function DocVersionBanner(props: Props): JSX.Element;
}

declare module '@theme/DocVersionBadge' {
  export interface Props {
    readonly className?: string;
  }

  export default function DocVersionBadge(props: Props): JSX.Element;
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

  const DocPage: (props: Props) => JSX.Element;
  export default DocPage;
}

declare module '@theme/Seo' {
  import type {ReactNode} from 'react';

  export interface Props {
    readonly title?: string;
    readonly description?: string;
    readonly keywords?: readonly string[] | string;
    readonly image?: string;
    readonly children?: ReactNode;
  }

  const Seo: (props: Props) => JSX.Element;
  export default Seo;
}

declare module '@theme/hooks/useDocs' {
  type GlobalPluginData = import('./types').GlobalPluginData;
  type GlobalVersion = import('./types').GlobalVersion;
  type ActivePlugin = import('./client/docsClientUtils').ActivePlugin;
  type ActiveDocContext = import('./client/docsClientUtils').ActiveDocContext;
  type DocVersionSuggestions =
    import('./client/docsClientUtils').DocVersionSuggestions;
  type GetActivePluginOptions =
    import('./client/docsClientUtils').GetActivePluginOptions;

  export type {GlobalPluginData, GlobalVersion};
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
