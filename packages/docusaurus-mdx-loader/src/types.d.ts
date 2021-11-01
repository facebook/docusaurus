/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/mdx-loader' {
  import type {Plugin} from 'unified';

  export type RemarkOrRehypePlugin =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [Plugin<any[]>, Record<string, unknown>] | Plugin<any[]>;
  export type RemarkAndRehypePluginOptions = {
    remarkPlugins: RemarkOrRehypePlugin[];
    rehypePlugins: RemarkOrRehypePlugin[];
    beforeDefaultRemarkPlugins: RemarkOrRehypePlugin[];
    beforeDefaultRehypePlugins: RemarkOrRehypePlugin[];
  };
}

// TODO Types provided by MDX 2.0 https://github.com/mdx-js/mdx/blob/main/packages/mdx/types/index.d.ts
declare module '@mdx-js/mdx' {
  import type {Processor} from 'unified';
  import type {RemarkOrRehypePlugin} from '@docusaurus/mdx-loader';

  namespace mdx {
    interface Options {
      filepath?: string;
      skipExport?: boolean;
      wrapExport?: string;
      remarkPlugins?: RemarkOrRehypePlugin[];
      rehypePlugins?: RemarkOrRehypePlugin[];
    }

    function sync(content: string, options?: Options): string;
    function createMdxAstCompiler(options?: Options): Processor;
    function createCompiler(options?: Options): Processor;
  }
  function mdx(content: string, options?: mdx.Options): Promise<string>;

  export default mdx;
}
