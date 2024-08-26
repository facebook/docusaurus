/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Options} from './loader';
import type {RuleSetRule, RuleSetUseItem} from 'webpack';

export async function createMDXLoaderItem(
  options: Options,
): Promise<RuleSetUseItem> {
  return {
    loader: require.resolve('@docusaurus/mdx-loader'),
    options,
  };
}

export async function createMDXLoaderRule({
  include,
  options,
}: {
  include: RuleSetRule['include'];
  options: Options;
}): Promise<RuleSetRule> {
  return {
    test: /\.mdx?$/i,
    include,
    use: [await createMDXLoaderItem(options)],
  };
}
