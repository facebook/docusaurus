/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/mdx-loader' {
  // eslint-disable-next-line import/no-unresolved
  import type {Node as BaseNode} from 'unist';

  export type Node = BaseNode & {
    id?: string;
    value?: string;
    children?: Node[];
    data?: Record<string, unknown> & {
      hProperties?: Record<string, string>;
    };
  };
  export type HeadingNode = Node & {
    type: 'heading';
    children: Node[];
    depth: 1 | 2 | 3 | 4 | 5 | 6;
  };
  export type CodeBlockNode = Node & {
    type: 'code';
    lang?: string;
    meta?: string;
  };
  export type LinkNode = Node & {
    title?: string;
    url: string;
    children: Node[];
  };
  export type ImageNode = Node & {
    title?: string;
    alt?: string;
    url?: string;
  };
  export type ExportNode = Node & {
    type: 'export';
    default: boolean;
  };
  export interface RemarkAndRehypePluginOptions {
    remarkPlugins: RemarkOrRehypePlugin[];
    rehypePlugins: string[];
    beforeDefaultRemarkPlugins: RemarkOrRehypePlugin[];
    beforeDefaultRehypePlugins: RemarkOrRehypePlugin[];
  }
}

// TODO Types provided by MDX 2.0 https://github.com/mdx-js/mdx/blob/main/packages/mdx/types/index.d.ts
declare module '@mdx-js/mdx' {
  import type {Plugin, Processor} from 'unified';

  export namespace mdx {
    interface Options {
      filepath?: string;
      skipExport?: boolean;
      wrapExport?: string;
      remarkPlugins?: Plugin[];
      rehypePlugins?: Plugin[];
    }

    function sync(content: string, options?: Options): string;
    function createMdxAstCompiler(options?: Options): Processor;
    function createCompiler(options?: Options): Processor;
  }
  export default function mdx(
    content: string,
    options?: mdx.Options,
  ): Promise<string>;
}
