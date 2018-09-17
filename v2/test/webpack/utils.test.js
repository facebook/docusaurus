import {validate} from 'webpack';
import path from 'path';
import Config from 'webpack-chain';

import {applyConfigureWebpack, applyChainWebpack} from '@lib/webpack/utils';

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

    console.log(errors);
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

  test('use webpack-chain API', async () => {
    // fake generated webpack config in webpack-chain format
    let config = new Config();
    config.output.path(__dirname).filename('bundle.js');

    // user chainWebpack
    /* eslint-disable */
    const chainWebpack = (oldConfig, isServer) => {
      if (!isServer) {
        oldConfig.entry('main').add('./entry.js');
        oldConfig.output
          .path(path.join(__dirname, 'dist'))
          .filename('new.bundle.js');
      }
    };
    /* eslint-enable */

    applyChainWebpack(chainWebpack, config, false);

    // transform to webpack configuration object format
    config = config.toConfig();
    expect(config).toEqual({
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'new.bundle.js',
      },
      entry: {
        main: ['./entry.js'],
      },
    });
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });
});
