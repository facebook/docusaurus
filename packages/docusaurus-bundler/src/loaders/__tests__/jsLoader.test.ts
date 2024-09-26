/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {fromPartial} from '@total-typescript/shoehorn';
import {createJsLoaderFactory} from '../jsLoader';

import type {RuleSetRule} from 'webpack';

describe('createJsLoaderFactory', () => {
  function testJsLoaderFactory(
    siteConfig?: Parameters<typeof createJsLoaderFactory>[0]['siteConfig'],
  ) {
    return createJsLoaderFactory({
      siteConfig: {
        ...siteConfig,
        webpack: {
          jsLoader: 'babel',
          ...siteConfig?.webpack,
        },
        future: fromPartial(siteConfig?.future),
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
