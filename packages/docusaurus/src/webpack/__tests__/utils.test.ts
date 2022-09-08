/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import webpack, {type Configuration, type RuleSetRule} from 'webpack';

import {
  getCustomizableJSLoader,
  applyConfigureWebpack,
  applyConfigurePostCss,
  getHttpsConfig,
} from '../utils';
import type {Plugin} from '@docusaurus/types';

describe('customize JS loader', () => {
  it('getCustomizableJSLoader defaults to babel loader', () => {
    expect(getCustomizableJSLoader()({isServer: true}).loader).toBe(
      require.resolve('babel-loader'),
    );
    expect(getCustomizableJSLoader()({isServer: false}).loader).toBe(
      require.resolve('babel-loader'),
    );
  });

  it('getCustomizableJSLoader accepts loaders with preset', () => {
    expect(getCustomizableJSLoader('babel')({isServer: true}).loader).toBe(
      require.resolve('babel-loader'),
    );
    expect(getCustomizableJSLoader('babel')({isServer: false}).loader).toBe(
      require.resolve('babel-loader'),
    );
  });

  it('getCustomizableJSLoader allows customization', () => {
    const customJSLoader = (isServer: boolean): RuleSetRule => ({
      loader: 'my-fast-js-loader',
      options: String(isServer),
    });

    expect(getCustomizableJSLoader(customJSLoader)({isServer: true})).toEqual(
      customJSLoader(true),
    );
    expect(getCustomizableJSLoader(customJSLoader)({isServer: false})).toEqual(
      customJSLoader(false),
    );
  });
});

describe('extending generated webpack config', () => {
  it('direct mutation on generated webpack config object', async () => {
    // Fake generated webpack config
    let config: Configuration = {
      output: {
        path: __dirname,
        filename: 'bundle.js',
      },
    };

    // @ts-expect-error: Testing an edge-case that we did not write types for
    const configureWebpack: NonNullable<Plugin['configureWebpack']> = (
      generatedConfig,
      isServer,
    ) => {
      if (!isServer) {
        generatedConfig.entry = 'entry.js';
        generatedConfig.output = {
          path: path.join(__dirname, 'dist'),
          filename: 'new.bundle.js',
        };
      }
      // Implicitly returning undefined to test null-safety
    };

    config = applyConfigureWebpack(configureWebpack, config, false, undefined, {
      content: 42,
    });
    expect(config).toEqual({
      entry: 'entry.js',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'new.bundle.js',
      },
    });
    const errors = webpack.validate(config);
    expect(errors).toBeUndefined();
  });

  it('webpack-merge with user webpack config object', async () => {
    let config: Configuration = {
      output: {
        path: __dirname,
        filename: 'bundle.js',
      },
    };

    const configureWebpack: Plugin['configureWebpack'] = () => ({
      entry: 'entry.js',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'new.bundle.js',
      },
    });

    config = applyConfigureWebpack(configureWebpack, config, false, undefined, {
      content: 42,
    });
    expect(config).toEqual({
      entry: 'entry.js',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'new.bundle.js',
      },
    });
    const errors = webpack.validate(config);
    expect(errors).toBeUndefined();
  });

  it('webpack-merge with custom strategy', async () => {
    const config: Configuration = {
      module: {
        rules: [{use: 'xxx'}, {use: 'yyy'}],
      },
    };

    const createConfigureWebpack =
      (mergeStrategy?: {
        [key: string]: 'prepend' | 'append';
      }): NonNullable<Plugin['configureWebpack']> =>
      () => ({
        module: {
          rules: [{use: 'zzz'}],
        },
        mergeStrategy,
      });

    const defaultStrategyMergeConfig = applyConfigureWebpack(
      createConfigureWebpack(),
      config,
      false,
      undefined,
      {content: 42},
    );
    expect(defaultStrategyMergeConfig).toEqual({
      module: {
        rules: [{use: 'xxx'}, {use: 'yyy'}, {use: 'zzz'}],
      },
    });

    const prependRulesStrategyConfig = applyConfigureWebpack(
      createConfigureWebpack({'module.rules': 'prepend'}),
      config,
      false,
      undefined,
      {content: 42},
    );
    expect(prependRulesStrategyConfig).toEqual({
      module: {
        rules: [{use: 'zzz'}, {use: 'xxx'}, {use: 'yyy'}],
      },
    });

    const uselessMergeStrategyConfig = applyConfigureWebpack(
      createConfigureWebpack({uselessAttributeName: 'append'}),
      config,
      false,
      undefined,
      {content: 42},
    );
    expect(uselessMergeStrategyConfig).toEqual({
      module: {
        rules: [{use: 'xxx'}, {use: 'yyy'}, {use: 'zzz'}],
      },
    });
  });
});

describe('extending PostCSS', () => {
  it('user plugin should be appended in PostCSS loader', () => {
    let webpackConfig: Configuration = {
      output: {
        path: __dirname,
        filename: 'bundle.js',
      },
      module: {
        rules: [
          {
            test: 'any',
            use: [
              {
                loader: 'some-loader-1',
                options: {},
              },
              {
                loader: 'some-loader-2',
                options: {},
              },
              {
                loader: 'postcss-loader-1',
                options: {
                  postcssOptions: {
                    plugins: [['default-postcss-loader-1-plugin']],
                  },
                },
              },
              {
                loader: 'some-loader-3',
                options: {},
              },
            ],
          },
          {
            test: '2nd-test',
            use: [
              {
                loader: 'postcss-loader-2',
                options: {
                  postcssOptions: {
                    plugins: [['default-postcss-loader-2-plugin']],
                  },
                },
              },
            ],
          },
        ],
      },
    };

    function createFakePlugin(name: string) {
      return [name, {}];
    }

    // Run multiple times: ensure last run does not override previous runs
    webpackConfig = applyConfigurePostCss(
      (postCssOptions) => ({
        ...postCssOptions,
        plugins: [
          ...postCssOptions.plugins,
          createFakePlugin('postcss-plugin-1'),
        ],
      }),
      webpackConfig,
    );

    webpackConfig = applyConfigurePostCss(
      (postCssOptions) => ({
        ...postCssOptions,
        plugins: [
          createFakePlugin('postcss-plugin-2'),
          ...postCssOptions.plugins,
        ],
      }),
      webpackConfig,
    );

    webpackConfig = applyConfigurePostCss(
      (postCssOptions) => ({
        ...postCssOptions,
        plugins: [
          ...postCssOptions.plugins,
          createFakePlugin('postcss-plugin-3'),
        ],
      }),
      webpackConfig,
    );

    // @ts-expect-error: relax type
    const postCssLoader1 = webpackConfig.module?.rules[0].use[2];
    expect(postCssLoader1.loader).toBe('postcss-loader-1');

    const pluginNames1 = postCssLoader1.options.postcssOptions.plugins.map(
      (p: unknown[]) => p[0],
    );
    expect(pluginNames1).toHaveLength(4);
    expect(pluginNames1).toEqual([
      'postcss-plugin-2',
      'default-postcss-loader-1-plugin',
      'postcss-plugin-1',
      'postcss-plugin-3',
    ]);

    // @ts-expect-error: relax type
    const postCssLoader2 = webpackConfig.module?.rules[1].use[0];
    expect(postCssLoader2.loader).toBe('postcss-loader-2');

    const pluginNames2 = postCssLoader2.options.postcssOptions.plugins.map(
      (p: unknown[]) => p[0],
    );
    expect(pluginNames2).toHaveLength(4);
    expect(pluginNames2).toEqual([
      'postcss-plugin-2',
      'default-postcss-loader-2-plugin',
      'postcss-plugin-1',
      'postcss-plugin-3',
    ]);
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
