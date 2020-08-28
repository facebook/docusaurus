/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */

declare module '@docusaurus/plugin-content-docs-types' {
  export type PermalinkToSidebar = {
    [permalink: string]: string;
  };

  export type PropVersionMetadata = {
    version: string;
    label: string;
    docsSidebars: PropSidebars;
    permalinkToSidebar: PermalinkToSidebar;
  };

  export type PropSidebarItemLink = {
    type: 'link';
    href: string;
    label: string;
  };

  export type PropSidebarItemCategory = {
    type: 'category';
    label: string;
    items: PropSidebarItem[];
    collapsed?: boolean;
  };

  export type PropSidebarItem = PropSidebarItemLink | PropSidebarItemCategory;

  export type PropSidebars = {
    [sidebarId: string]: PropSidebarItem[];
  };
}

declare module '@theme/DocItem' {
  import type {MarkdownRightTableOfContents} from '@docusaurus/types';

  export type DocumentRoute = {
    readonly component: () => JSX.Element;
    readonly exact: boolean;
    readonly path: string;
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
    readonly lastUpdatedBy?: string;
    readonly version?: string;
    readonly previous?: {readonly permalink: string; readonly title: string};
    readonly next?: {readonly permalink: string; readonly title: string};
  };

  export type Props = {
    readonly route: DocumentRoute;
    readonly content: {
      readonly frontMatter: FrontMatter;
      readonly metadata: Metadata;
      readonly rightToc: readonly MarkdownRightTableOfContents[];
      (): JSX.Element;
    };
  };

  const DocItem: (props: Props) => JSX.Element;
  export default DocItem;
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
      readonly routes: readonly DocumentRoute[];
    };
  };

  const DocPage: (props: Props) => JSX.Element;
  export default DocPage;
}
