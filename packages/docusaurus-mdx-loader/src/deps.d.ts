/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// TODO Types provided by MDX 2.0 https://github.com/mdx-js/mdx/blob/main/packages/mdx/types/index.d.ts
declare module '@mdx-js/mdx' {
  import type {Processor, Plugin} from 'unified';

  type MDXPlugin =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [Plugin<any[]>, any] | Plugin<any[]>;

  type Options = {
    filepath?: string;
    skipExport?: boolean;
    wrapExport?: string;
    remarkPlugins?: MDXPlugin[];
    rehypePlugins?: MDXPlugin[];
  };

  export function sync(content: string, options?: Options): string;
  export function createMdxAstCompiler(options?: Options): Processor;
  export function createCompiler(options?: Options): Processor;
  export default function mdx(
    content: string,
    options?: Options,
  ): Promise<string>;
}
