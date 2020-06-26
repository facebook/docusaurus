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

import {applyConfigureWebpack} from '../utils';
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
