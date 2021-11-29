/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
