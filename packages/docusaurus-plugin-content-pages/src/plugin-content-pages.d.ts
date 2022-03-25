/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-content-pages' {
  import type {RemarkAndRehypePluginOptions} from '@docusaurus/mdx-loader';

  export type PluginOptions = RemarkAndRehypePluginOptions & {
    id?: string;
    path: string;
    routeBasePath: string;
    include: string[];
    exclude: string[];
    mdxPageComponent: string;
    admonitions: {[key: string]: unknown};
  };

  export type Options = Partial<PluginOptions>;

  export type FrontMatter = {
    readonly title?: string;
    readonly description?: string;
    readonly wrapperClassName?: string;
    readonly hide_table_of_contents?: string;
    readonly toc_min_heading_level?: number;
    readonly toc_max_heading_level?: number;
  };

  export type JSXPageMetadata = {
    type: 'jsx';
    permalink: string;
    source: string;
  };

  export type MDXPageMetadata = {
    type: 'mdx';
    permalink: string;
    source: string;
    frontMatter: FrontMatter & {[key: string]: unknown};
    title?: string;
    description?: string;
  };

  export type Metadata = JSXPageMetadata | MDXPageMetadata;
}

declare module '@theme/MDXPage' {
  import type {TOCItem} from '@docusaurus/types';
  import type {
    MDXPageMetadata,
    FrontMatter,
  } from '@docusaurus/plugin-content-pages';

  export interface Props {
    readonly content: {
      readonly frontMatter: FrontMatter;
      readonly metadata: MDXPageMetadata;
      readonly toc: readonly TOCItem[];
      (): JSX.Element;
    };
  }

  export default function MDXPage(props: Props): JSX.Element;
}
