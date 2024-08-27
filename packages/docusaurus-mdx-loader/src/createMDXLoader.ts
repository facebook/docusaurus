/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createProcessors} from './processor';
import type {Options} from './loader';
import type {RuleSetRule, RuleSetUseItem} from 'webpack';

async function enhancedOptions(options: Options): Promise<Options> {
  // Because Jest doesn't like ESM / createProcessors()
  if (process.env.N0DE_ENV === 'test' || process.env.JEST_WORKER_ID) {
    return options;
  }

  // We create the processor earlier here, to avoid the lazy processor creating
  // Lazy creation messes-up with Rsdoctor ability to measure mdx-loader perf
  const newOptions: Options = options.processors
    ? options
    : {...options, processors: await createProcessors({options})};

  return newOptions;
}

export async function createMDXLoaderItem(
  options: Options,
): Promise<RuleSetUseItem> {
  return {
    loader: require.resolve('@docusaurus/mdx-loader'),
    options: await enhancedOptions(options),
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
