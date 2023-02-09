/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-content-pages' {
  import type {MDXOptions} from '@docusaurus/mdx-loader';
  import type {LoadContext, Plugin} from '@docusaurus/types';

  export type PluginOptions = MDXOptions & {
    id?: string;
    path: string;
    routeBasePath: string;
    include: string[];
    exclude: string[];
    mdxPageComponent: string;
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

  export type LoadedContent = Metadata[];

  export default function pluginContentPages(
    context: LoadContext,
    options: PluginOptions,
  ): Promise<Plugin<LoadedContent | null>>;
}

declare module '@theme/MDXPage' {
  import type {LoadedMDXContent} from '@docusaurus/mdx-loader';
  import type {
    MDXPageMetadata,
    FrontMatter,
  } from '@docusaurus/plugin-content-pages';

  export interface Props {
    readonly content: LoadedMDXContent<FrontMatter, MDXPageMetadata>;
  }

  export default function MDXPage(props: Props): JSX.Element;
}
