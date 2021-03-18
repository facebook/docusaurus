/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

type RemarkOrRehypePlugin =
  // eslint-disable-next-line @typescript-eslint/ban-types
  [Function, Record<string, unknown>] | Function;

declare function docusaurusMdxLoader(fileString: string): string;

export interface RemarkAndRehypePluginOptions {
  remarkPlugins: RemarkOrRehypePlugin[];
  rehypePlugins: string[];
  beforeDefaultRemarkPlugins: RemarkOrRehypePlugin[];
  beforeDefaultRehypePlugins: RemarkOrRehypePlugin[];
}
