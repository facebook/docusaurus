/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface PluginOptions {
  path: string;
  routeBasePath: string;
  include: string[];
  mdxPageComponent: string;
  remarkPlugins: ([Function, object] | Function)[];
  rehypePlugins: string[];
  admonitions: any;
}

export type JSXPageMetadata = {
  type: 'jsx';
  permalink: string;
  source: string;
};

export type MDXPageMetadata = {
  type: 'mdx';
  permalink: string;
  source: string;
};

export type Metadata = JSXPageMetadata | MDXPageMetadata;

export type LoadedContent = Metadata[];
