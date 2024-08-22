/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {createGetJSLoaderUtil, getHttpsConfig} from '../utils';
import type {RuleSetRule} from 'webpack';
import type {DeepPartial} from 'utility-types';

describe('customize JS loader', () => {
  function testCreateGetJSLoaderUtil(
    siteConfig?: DeepPartial<
      Parameters<typeof createGetJSLoaderUtil>[0]['siteConfig']
    >,
  ) {
    return createGetJSLoaderUtil({
      siteConfig: {
        ...siteConfig,
        webpack: {
          jsLoader: 'babel',
          ...siteConfig?.webpack,
        },
      },
    });
  }

  it('createGetJSLoaderUtil defaults to babel loader', () => {
    expect(testCreateGetJSLoaderUtil()({isServer: true}).loader).toBe(
      require.resolve('babel-loader'),
    );
    expect(testCreateGetJSLoaderUtil()({isServer: false}).loader).toBe(
      require.resolve('babel-loader'),
    );
  });

  it('createGetJSLoaderUtil accepts loaders with preset', () => {
    expect(
      testCreateGetJSLoaderUtil({webpack: {jsLoader: 'babel'}})({
        isServer: true,
      }).loader,
    ).toBe(require.resolve('babel-loader'));
    expect(
      testCreateGetJSLoaderUtil({webpack: {jsLoader: 'babel'}})({
        isServer: false,
      }).loader,
    ).toBe(require.resolve('babel-loader'));
  });

  it('createGetJSLoaderUtil allows customization', () => {
    const customJSLoader = (isServer: boolean): RuleSetRule => ({
      loader: 'my-fast-js-loader',
      options: String(isServer),
    });

    expect(
      testCreateGetJSLoaderUtil({webpack: {jsLoader: customJSLoader}})({
        isServer: true,
      }),
    ).toEqual(customJSLoader(true));
    expect(
      testCreateGetJSLoaderUtil({webpack: {jsLoader: customJSLoader}})({
        isServer: false,
      }),
    ).toEqual(customJSLoader(false));
  });
});

describe('getHttpsConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {...originalEnv};
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns true for HTTPS not env', async () => {
    await expect(getHttpsConfig()).resolves.toBe(false);
  });

  it('returns true for HTTPS in env', async () => {
    process.env.HTTPS = 'true';
    await expect(getHttpsConfig()).resolves.toBe(true);
  });

  it('returns custom certs if they are in env', async () => {
    process.env.HTTPS = 'true';
    process.env.SSL_CRT_FILE = path.join(__dirname, '__fixtures__/host.crt');
    process.env.SSL_KEY_FILE = path.join(__dirname, '__fixtures__/host.key');
    await expect(getHttpsConfig()).resolves.toEqual({
      key: expect.any(Buffer),
      cert: expect.any(Buffer),
    });
  });

  it("throws if file doesn't exist", async () => {
    process.env.HTTPS = 'true';
    process.env.SSL_CRT_FILE = path.join(
      __dirname,
      '__fixtures__/nonexistent.crt',
    );
    process.env.SSL_KEY_FILE = path.join(__dirname, '__fixtures__/host.key');
    await expect(getHttpsConfig()).rejects.toThrowErrorMatchingInlineSnapshot(
      `"You specified SSL_CRT_FILE in your env, but the file "<PROJECT_ROOT>/packages/docusaurus/src/webpack/__tests__/__fixtures__/nonexistent.crt" can't be found."`,
    );
  });

  it('throws for invalid key', async () => {
    process.env.HTTPS = 'true';
    process.env.SSL_CRT_FILE = path.join(__dirname, '__fixtures__/host.crt');
    process.env.SSL_KEY_FILE = path.join(__dirname, '__fixtures__/invalid.key');
    await expect(getHttpsConfig()).rejects.toThrow();
  });

  it('throws for invalid cert', async () => {
    process.env.HTTPS = 'true';
    process.env.SSL_CRT_FILE = path.join(__dirname, '__fixtures__/invalid.crt');
    process.env.SSL_KEY_FILE = path.join(__dirname, '__fixtures__/host.key');
    await expect(getHttpsConfig()).rejects.toThrow();
  });
});
