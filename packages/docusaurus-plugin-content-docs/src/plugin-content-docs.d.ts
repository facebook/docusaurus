/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */

declare module '@docusaurus/plugin-content-docs-types' {
  type VersionBanner = import('./types').VersionBanner;

  export type PropVersionMetadata = {
    pluginId: string;
    version: string;
    label: string;
    banner: VersionBanner;
    isLast: boolean;
    docsSidebars: PropSidebars;
  };

  type PropsSidebarItemBase = {
    customProps?: Record<string, unknown>;
  };

  export type PropSidebarItemLink = PropsSidebarItemBase & {
    type: 'link';
    href: string;
    label: string;
  };

  export type PropSidebarItemCategory = PropsSidebarItemBase & {
    type: 'category';
    label: string;
    items: PropSidebarItem[];
    collapsed: boolean;
    collapsible: boolean;
  };

  export type PropSidebarItem = PropSidebarItemLink | PropSidebarItemCategory;

  export type PropSidebars = {
    [sidebarId: string]: PropSidebarItem[];
  };

  export type {
    GlobalVersion as GlobalDataVersion,
    GlobalDoc as GlobalDataDoc,
  } from './types';
}

declare module '@theme/DocItem' {
  import type {TOCItem} from '@docusaurus/types';

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
    readonly previous?: {readonly permalink: string; readonly title: string};
    readonly next?: {readonly permalink: string; readonly title: string};
  };

  export type Props = {
    readonly route: DocumentRoute;
    readonly versionMetadata: PropVersionMetadata;
    readonly content: {
      readonly frontMatter: FrontMatter;
      readonly metadata: Metadata;
      readonly toc: readonly TOCItem[];
      readonly contentTitle: string | undefined;
      (): JSX.Element;
    };
  };

  const DocItem: (props: Props) => JSX.Element;
  export default DocItem;
}

declare module '@theme/DocVersionBanner' {
  import type {PropVersionMetadata} from '@docusaurus/plugin-content-docs-types';

  export type Props = {
    readonly versionMetadata: PropVersionMetadata;
  };

  const DocVersionBanner: (props: Props) => JSX.Element;
  export default DocVersionBanner;
}

declare module '@theme/DocPage' {
  import type {PropVersionMetadata} from '@docusaurus/plugin-content-docs-types';
  import type {DocumentRoute} from '@theme/DocItem';

  export type Props = {
    readonly location: {readonly pathname: string};
    readonly versionMetadata: PropVersionMetadata;
    readonly route: {
      readonly path: string;
      readonly component: () => JSX.Element;
      readonly routes: DocumentRoute[];
    };
  };

  const DocPage: (props: Props) => JSX.Element;
  export default DocPage;
}

declare module '@theme/Seo' {
  export type Props = {
    readonly title?: string;
    readonly description?: string;
    readonly keywords?: readonly string[] | string;
    readonly image?: string;
  };

  const Seo: (props: Props) => JSX.Element;
  export default Seo;
}
