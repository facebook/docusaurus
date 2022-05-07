/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {mdxLoader} from './loader';

export default mdxLoader;

export type TOCItem = {
  readonly value: string;
  readonly id: string;
  readonly level: number;
};

export type LoadedMDXContent<FrontMatter, Metadata, Assets = undefined> = {
  /** As verbatim declared in the MDX document. */
  readonly frontMatter: FrontMatter;
  /** As provided by the content plugin. */
  readonly metadata: Metadata;
  /** A list of TOC items (headings). */
  readonly toc: readonly TOCItem[];
  /** First h1 title before any content. */
  readonly contentTitle: string | undefined;
  /**
   * Usually image assets that may be collocated like `./img/thumbnail.png`.
   * The loader would also bundle these assets and the client should use these
   * in priority.
   */
  readonly assets: Assets;
  (): JSX.Element;
};
export type {Options, MDXPlugin, MDXOptions} from './loader';
