/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getBabelOptions} from '@docusaurus/babel';
import {importSwcLoader, importGetSwcLoaderOptions} from '../importFaster';
import {getCurrentBundler} from '../currentBundler';
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

async function createSwcJsLoaderFactory(): Promise<
  ConfigureWebpackUtils['getJSLoader']
> {
  const loader = await importSwcLoader();
  const getOptions = await importGetSwcLoaderOptions();
  return ({isServer}) => {
    return {
      loader,
      options: getOptions({isServer}),
    };
  };
}

// Same as swcLoader, except we use the built-in SWC loader
async function createRspackSwcJsLoaderFactory(): Promise<
  ConfigureWebpackUtils['getJSLoader']
> {
  const loader = 'builtin:swc-loader';
  const getOptions = await importGetSwcLoaderOptions();
  return ({isServer}) => {
    return {
      loader,
      options: getOptions({isServer}),
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
      experimental_faster: DocusaurusConfig['future']['experimental_faster'];
    };
  };
}): Promise<ConfigureWebpackUtils['getJSLoader']> {
  const currentBundler = await getCurrentBundler({siteConfig});
  const isSWCLoader = siteConfig.future.experimental_faster.swcJsLoader;
  if (isSWCLoader) {
    if (siteConfig.webpack?.jsLoader) {
      throw new Error(
        `You can't use siteConfig.webpack.jsLoader and siteConfig.future.experimental_faster.swcJsLoader at the same time.
To avoid any configuration ambiguity, you must make an explicit choice:
- If you want to use Docusaurus Faster and SWC (recommended), remove siteConfig.webpack.jsLoader
- If you want to use a custom JS loader, use siteConfig.future.experimental_faster.swcJsLoader: false`,
      );
    }
    return currentBundler.name === 'rspack'
      ? createRspackSwcJsLoaderFactory()
      : createSwcJsLoaderFactory();
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
