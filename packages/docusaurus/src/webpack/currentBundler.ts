/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import webpack from 'webpack';
import type {CurrentBundler, DocusaurusConfig} from '@docusaurus/types';

export async function getCurrentBundler({
  siteConfig,
}: {
  siteConfig: {
    future: {
      experimental_faster: Pick<
        DocusaurusConfig['future']['experimental_faster'],
        'rspackBundler'
      >;
    };
  };
}): Promise<CurrentBundler> {
  if (siteConfig.future.experimental_faster.rspackBundler) {
    // TODO add support for Rspack
    throw new Error('Rspack bundler is not supported yet');
  }
  return {
    name: 'webpack',
    instance: webpack,
  };
}
