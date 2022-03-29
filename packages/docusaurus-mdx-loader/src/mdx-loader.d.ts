/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Plugin} from 'unified';

export type MDXPlugin =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Plugin<any[]>, any] | Plugin<any[]>;
export type MDXOptions = {
  remarkPlugins: MDXPlugin[];
  rehypePlugins: MDXPlugin[];
  beforeDefaultRemarkPlugins: MDXPlugin[];
  beforeDefaultRehypePlugins: MDXPlugin[];
};
