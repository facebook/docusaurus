/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {createJsLoaderFactory} from '../jsLoader';

import type {RuleSetRule} from 'webpack';

type SiteConfigSlice = Parameters<
  typeof createJsLoaderFactory
>[0]['siteConfig'];

describe('createJsLoaderFactory', () => {
  function testJsLoaderFactory(siteConfig?: SiteConfigSlice) {
    return createJsLoaderFactory({
      siteConfig: {webpack: siteConfig?.webpack},
    });
  }

  it('createJsLoaderFactory defaults to built-in SWC loader with Rspack', async () => {
    const createJsLoader = await testJsLoaderFactory();
    expect(createJsLoader({isServer: true}).loader).toBe('builtin:swc-loader');
    expect(createJsLoader({isServer: false}).loader).toBe('builtin:swc-loader');
  });

  it('createJsLoaderFactory defaults to babel loader with Webpack', async () => {
    const createJsLoader = await testJsLoaderFactory({webpack: {}});
    expect(createJsLoader({isServer: true}).loader).toBe(
      require.resolve('babel-loader'),
    );
    expect(createJsLoader({isServer: false}).loader).toBe(
      require.resolve('babel-loader'),
    );
  });

  it('createJsLoaderFactory accepts babel loader preset', async () => {
    const createJsLoader = await testJsLoaderFactory({
      webpack: {jsLoader: 'babel'},
    });
    expect(createJsLoader({isServer: true}).loader).toBe(
      require.resolve('babel-loader'),
    );
    expect(createJsLoader({isServer: false}).loader).toBe(
      require.resolve('babel-loader'),
    );
  });

  it('createJsLoaderFactory accepts custom loader', async () => {
    const createJsLoader = await testJsLoaderFactory({
      webpack: {
        jsLoader: (isServer) => {
          return {loader: `my-loader-${isServer ? 'server' : 'client'}`};
        },
      },
    });
    expect(createJsLoader({isServer: true}).loader).toBe('my-loader-server');
    expect(createJsLoader({isServer: false}).loader).toBe('my-loader-client');
  });

  it('createJsLoaderFactory accepts loaders with preset', async () => {
    const createJsLoader = await testJsLoaderFactory({
      webpack: {jsLoader: 'babel'},
    });

    expect(
      createJsLoader({
        isServer: true,
      }).loader,
    ).toBe(require.resolve('babel-loader'));
    expect(
      createJsLoader({
        isServer: false,
      }).loader,
    ).toBe(require.resolve('babel-loader'));
  });

  it('createJsLoaderFactory allows customization', async () => {
    const customJSLoader = (isServer: boolean): RuleSetRule => ({
      loader: 'my-fast-js-loader',
      options: String(isServer),
    });

    const createJsLoader = await testJsLoaderFactory({
      webpack: {jsLoader: customJSLoader},
    });

    expect(
      createJsLoader({
        isServer: true,
      }),
    ).toEqual(customJSLoader(true));
    expect(
      createJsLoader({
        isServer: false,
      }),
    ).toEqual(customJSLoader(false));
  });
});
