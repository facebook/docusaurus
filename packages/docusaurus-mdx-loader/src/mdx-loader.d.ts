/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Plugin} from 'unified';
import type {TOCItem} from '@docusaurus/types';

export type MDXPlugin =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Plugin<any[]>, any] | Plugin<any[]>;
export type MDXOptions = {
  remarkPlugins: MDXPlugin[];
  rehypePlugins: MDXPlugin[];
  beforeDefaultRemarkPlugins: MDXPlugin[];
  beforeDefaultRehypePlugins: MDXPlugin[];
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
