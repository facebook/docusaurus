/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  // @ts-expect-error: seems it's not in the typedefs???
  validate,
  Configuration,
} from 'webpack';
import path from 'path';

import {
  applyConfigureWebpack,
  applyConfigurePostCss,
  getFileLoaderUtils,
} from '../utils';
import {
  ConfigureWebpackFn,
  ConfigureWebpackFnMergeStrategy,
} from '@docusaurus/types';

describe('extending generated webpack config', () => {
  test('direct mutation on generated webpack config object', async () => {
    // fake generated webpack config
    let config: Configuration = {
      output: {
        path: __dirname,
        filename: 'bundle.js',
      },
    };

    const configureWebpack: ConfigureWebpackFn = (
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
      return {};
    };

    config = applyConfigureWebpack(configureWebpack, config, false);
    expect(config).toEqual({
      entry: 'entry.js',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'new.bundle.js',
      },
    });
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });

  test('webpack-merge with user webpack config object', async () => {
    let config: Configuration = {
      output: {
        path: __dirname,
        filename: 'bundle.js',
      },
    };

    const configureWebpack: ConfigureWebpackFn = () => ({
      entry: 'entry.js',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'new.bundle.js',
      },
    });

    config = applyConfigureWebpack(configureWebpack, config, false);
    expect(config).toEqual({
      entry: 'entry.js',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'new.bundle.js',
      },
    });
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });

  test('webpack-merge with custom strategy', async () => {
    const config: Configuration = {
      module: {
        rules: [{use: 'xxx'}, {use: 'yyy'}],
      },
    };

    const createConfigureWebpack: (
      mergeStrategy?: ConfigureWebpackFnMergeStrategy,
    ) => ConfigureWebpackFn = (mergeStrategy) => () => ({
      module: {
        rules: [{use: 'zzz'}],
      },
      mergeStrategy,
    });

    const defaultStrategyMergeConfig = applyConfigureWebpack(
      createConfigureWebpack(),
      config,
      false,
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
    );
    expect(uselessMergeStrategyConfig).toEqual({
      module: {
        rules: [{use: 'xxx'}, {use: 'yyy'}, {use: 'zzz'}],
      },
    });
  });
});

describe('getFileLoaderUtils()', () => {
  test('plugin svgo/removeViewBox should be disabled', () => {
    const {oneOf} = getFileLoaderUtils().rules.svg();
    expect(oneOf[0].use).toContainEqual(
      expect.objectContaining({
        loader: '@svgr/webpack',
        options: expect.objectContaining({
          svgoConfig: {
            plugins: [{removeViewBox: false}],
          },
        }),
      }),
    );
  });
});

describe('extending PostCSS', () => {
  test('user plugin should be appended in PostCSS loader', () => {
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
    webpackConfig = applyConfigurePostCss((postCssOptions) => {
      return {
        ...postCssOptions,
        plugins: [
          ...postCssOptions.plugins,
          createFakePlugin('postcss-plugin-1'),
        ],
      };
    }, webpackConfig);

    webpackConfig = applyConfigurePostCss((postCssOptions) => {
      return {
        ...postCssOptions,
        plugins: [
          createFakePlugin('postcss-plugin-2'),
          ...postCssOptions.plugins,
        ],
      };
    }, webpackConfig);

    webpackConfig = applyConfigurePostCss((postCssOptions) => {
      return {
        ...postCssOptions,
        plugins: [
          ...postCssOptions.plugins,
          createFakePlugin('postcss-plugin-3'),
        ],
      };
    }, webpackConfig);

    // @ts-expect-error: relax type
    const postCssLoader1 = webpackConfig.module?.rules[0].use[2];
    expect(postCssLoader1.loader).toEqual('postcss-loader-1');

    const pluginNames1 = postCssLoader1.options.postcssOptions.plugins.map(
      // @ts-expect-error: relax type
      (p: unknown) => p[0],
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
    expect(postCssLoader2.loader).toEqual('postcss-loader-2');

    const pluginNames2 = postCssLoader2.options.postcssOptions.plugins.map(
      // @ts-expect-error: relax type
      (p: unknown) => p[0],
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
