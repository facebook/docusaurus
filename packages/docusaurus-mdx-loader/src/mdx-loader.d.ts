/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Plugin} from 'unified';

export type RemarkOrRehypePlugin =
  | [Plugin<unknown[]>, Record<string, unknown>]
  | Plugin<unknown[]>;
export type RemarkAndRehypePluginOptions = {
  remarkPlugins: RemarkOrRehypePlugin[];
  rehypePlugins: RemarkOrRehypePlugin[];
  beforeDefaultRemarkPlugins: RemarkOrRehypePlugin[];
  beforeDefaultRehypePlugins: RemarkOrRehypePlugin[];
};
