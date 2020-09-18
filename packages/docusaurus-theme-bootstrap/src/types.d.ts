/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-duplicates */
/* eslint-disable spaced-comment */
/// <reference types="@docusaurus/module-type-aliases" />
/// <reference types="@docusaurus/plugin-content-blog" />
/// <reference types="@docusaurus/plugin-content-docs" />
/// <reference types="@docusaurus/plugin-content-pages" />

declare module '@theme/BlogListPaginator' {
  import type {Metadata} from '@theme/BlogListPage';

  export type Props = {readonly metadata: Metadata};

  const BlogListPaginator: (props: Props) => JSX.Element;
  export default BlogListPaginator;
}

declare module '@theme/BlogPostItem' {
  import type {FrontMatter, Metadata} from '@theme/BlogPostPage';

  export type Props = {
    readonly frontMatter: FrontMatter;
    readonly metadata: Metadata;
    readonly truncated?: string | boolean;
    readonly isBlogPostPage?: boolean;
    readonly children: JSX.Element;
  };

  const BlogPostItem: (props: Props) => JSX.Element;
  export default BlogPostItem;
}

declare module '@theme/BlogPostPaginator' {
  type Item = {readonly title: string; readonly permalink: string};

  export type Props = {readonly nextItem?: Item; readonly prevItem?: Item};

  const BlogPostPaginator: (props: Props) => JSX.Element;
  export default BlogPostPaginator;
}

declare module '@theme/CodeBlock' {
  export type Props = {
    readonly children: string;
    readonly className: string;
  };

  const CodeBlock: (props: Props) => JSX.Element;
  export default CodeBlock;
}

declare module '@theme/DocPaginator' {
  type PageInfo = {readonly permalink: string; readonly title: string};

  export type Props = {
    readonly metadata: {readonly previous?: PageInfo; readonly next?: PageInfo};
  };

  const DocPaginator: (props: Props) => JSX.Element;
  export default DocPaginator;
}

declare module '@theme/DocSidebar' {
  import type {PropSidebarItem} from '@docusaurus/plugin-content-docs-types';

  export type Props = {
    readonly sidebar: readonly PropSidebarItem[];
  };

  const DocSidebar: (props: Props) => JSX.Element;
  export default DocSidebar;
}

declare module '@theme/Tabs' {
  import type {ReactElement, ReactNode} from 'react';

  export type Props = {
    readonly block?: boolean;
    readonly children: readonly ReactElement<{value: string}>[];
    readonly defaultValue?: string;
    readonly values: readonly {value: string; label: string}[];
    readonly groupId?: string;
  };

  const Tabs: () => JSX.Element;
  export default Tabs;
}

declare module '@theme/Footer' {
  const Footer: () => JSX.Element | null;
  export default Footer;
}

declare module '@theme/Navbar' {
  const Navbar: () => JSX.Element;
  export default Navbar;
}

declare module '@theme/TabItem' {
  import type {ReactNode} from 'react';

  export type Props = {readonly children: ReactNode};

  const TabItem: (props: Props) => JSX.Element;
  export default TabItem;
}
