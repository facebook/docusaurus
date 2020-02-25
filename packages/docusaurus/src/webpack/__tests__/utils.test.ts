/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validate} from 'webpack';
import path from 'path';

import {applyConfigureWebpack} from '../utils';

describe('extending generated webpack config', () => {
  test('direct mutation on generated webpack config object', async () => {
    // fake generated webpack config
    let config = {
      output: {
        path: __dirname,
        filename: 'bundle.js',
      },
    };

    /* eslint-disable */
    const configureWebpack = (generatedConfig, isServer) => {
      if (!isServer) {
        generatedConfig.entry = 'entry.js';
        generatedConfig.output = {
          path: path.join(__dirname, 'dist'),
          filename: 'new.bundle.js',
        };
      }
    };
    /* eslint-enable */

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
    // fake generated webpack config
    let config = {
      output: {
        path: __dirname,
        filename: 'bundle.js',
      },
    };

    /* eslint-disable */
    const configureWebpack = {
      entry: 'entry.js',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'new.bundle.js',
      },
    };
    /* eslint-enable */

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
});
