/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getBabelOptions} from '@docusaurus/babel';
import {getSwcLoaderOptions} from '../swc';
import {getCurrentBundler} from '../currentBundler';
import {getBrowserslistQueries} from '../browserslist';
import type {ConfigureWebpackUtils, DocusaurusConfig} from '@docusaurus/types';

const BabelJsLoaderFactory: ConfigureWebpackUtils['getJSLoader'] = ({
  isServer,
  babelOptions,
}) => {
  return {
    loader: require.resolve('babel-loader'),
    options: getBabelOptions({isServer, babelOptions}),
  };
};

function createRspackSwcJsLoaderFactory(): ConfigureWebpackUtils['getJSLoader'] {
  const loader = 'builtin:swc-loader';
  const clientBrowserslistQueries = getBrowserslistQueries();
  return ({isServer}) => {
    return {
      loader,
      options: getSwcLoaderOptions({
        isServer,
        bundlerName: 'rspack',
        clientBrowserslistQueries,
      }),
    };
  };
}

// Confusing: function that creates a function that creates actual js loaders
// This is done on purpose because the js loader factory is a public API
// It is injected in configureWebpack plugin lifecycle for plugin authors
export async function createJsLoaderFactory({
  siteConfig,
}: {
  siteConfig: {
    webpack?: DocusaurusConfig['webpack'];
    future: {
      faster: DocusaurusConfig['future']['faster'];
    };
  };
}): Promise<ConfigureWebpackUtils['getJSLoader']> {
  const currentBundler = await getCurrentBundler({siteConfig});
  if (currentBundler.name === 'rspack') {
    if (siteConfig.webpack?.jsLoader) {
      throw new Error(
        `You can't use siteConfig.webpack.jsLoader with siteConfig.future.faster.rspackBundler.
Rspack always uses its built-in SWC loader, please remove siteConfig.webpack.jsLoader.`,
      );
    }
    return createRspackSwcJsLoaderFactory();
  }

  const jsLoader = siteConfig.webpack?.jsLoader ?? 'babel';
  if (jsLoader instanceof Function) {
    return ({isServer}) => jsLoader(isServer);
  }
  if (jsLoader === 'babel') {
    return BabelJsLoaderFactory;
  }
  throw new Error(`Docusaurus bug: unexpected jsLoader value${jsLoader}`);
}
