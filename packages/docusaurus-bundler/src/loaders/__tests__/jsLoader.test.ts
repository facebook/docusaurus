/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {fromPartial, type PartialDeep} from '@total-typescript/shoehorn';
import {createJsLoaderFactory} from '../jsLoader';

import type {RuleSetRule} from 'webpack';

type SiteConfigSlice = Parameters<
  typeof createJsLoaderFactory
>[0]['siteConfig'];

describe('createJsLoaderFactory', () => {
  function testJsLoaderFactory(siteConfig?: {
    webpack?: SiteConfigSlice['webpack'];
    future?: PartialDeep<SiteConfigSlice['future']>;
  }) {
    return createJsLoaderFactory({
      siteConfig: {
        ...siteConfig,
        webpack: siteConfig?.webpack,
        future: fromPartial({
          ...siteConfig?.future,
          faster: fromPartial({
            ...siteConfig?.future?.faster,
          }),
        }),
      },
    });
  }

  it('createJsLoaderFactory defaults to babel loader', async () => {
    const createJsLoader = await testJsLoaderFactory();
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

  it('createJsLoaderFactory uses built-in SWC loader with Rspack', async () => {
    const createJsLoader = await testJsLoaderFactory({
      future: {faster: {rspackBundler: true}},
    });
    expect(createJsLoader({isServer: true}).loader).toBe('builtin:swc-loader');
    expect(createJsLoader({isServer: false}).loader).toBe('builtin:swc-loader');
  });

  it('createJsLoaderFactory rejects custom loader when using Rspack', async () => {
    await expect(() =>
      testJsLoaderFactory({
        future: {
          faster: {
            rspackBundler: true,
          },
        },
        webpack: {
          jsLoader: (isServer) => {
            return {loader: `my-loader-${isServer ? 'server' : 'client'}`};
          },
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: You can't use siteConfig.webpack.jsLoader with siteConfig.future.faster.rspackBundler.
      Rspack always uses its built-in SWC loader, please remove siteConfig.webpack.jsLoader.
      If you need a custom JS loader, opt out of Rspack with siteConfig.future.faster.rspackBundler: false.]
    `);
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
