/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/mdx-loader' {
  type RemarkOrRehypePlugin =
    // eslint-disable-next-line @typescript-eslint/ban-types
    [Function, Record<string, unknown>] | Function;
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

  namespace mdx {
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
  function mdx(content: string, options?: mdx.Options): Promise<string>;

  export default mdx;
}
