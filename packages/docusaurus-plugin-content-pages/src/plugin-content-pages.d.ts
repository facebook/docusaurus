/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-content-pages' {
  import type {MDXOptions} from '@docusaurus/mdx-loader';
  import type {LoadContext, Plugin} from '@docusaurus/types';

  export type Assets = {
    image?: string;
  };

  export type PluginOptions = MDXOptions & {
    id?: string;
    path: string;
    routeBasePath: string;
    include: string[];
    exclude: string[];
    mdxPageComponent: string;
  };

  export type Options = Partial<PluginOptions>;

  export type PageFrontMatter = {
    readonly title?: string;
    readonly description?: string;
    readonly image?: string;
    readonly keywords?: string[];
    readonly wrapperClassName?: string;
    readonly hide_table_of_contents?: string;
    readonly toc_min_heading_level?: number;
    readonly toc_max_heading_level?: number;
    readonly draft?: boolean;
    readonly unlisted?: boolean;
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
    frontMatter: PageFrontMatter & {[key: string]: unknown};
    title?: string;
    description?: string;
    unlisted: boolean;
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
    PageFrontMatter,
    Assets,
  } from '@docusaurus/plugin-content-pages';

  export interface Props {
    readonly content: LoadedMDXContent<
      PageFrontMatter,
      MDXPageMetadata,
      Assets
    >;
  }

  export default function MDXPage(props: Props): JSX.Element;
}
