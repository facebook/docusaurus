/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import webpack from 'webpack';

import {createBuildClientConfig, createStartClientConfig} from '../client';
import {loadSetup} from '../../server/__tests__/testUtils';

describe('webpack dev config', () => {
  it('simple start', async () => {
    const {props} = await loadSetup('simple-site');
    const {clientConfig} = await createStartClientConfig({
      props,
      minify: false,
      poll: false,
    });
    webpack.validate(clientConfig);
  });

  it('simple build', async () => {
    const {props} = await loadSetup('simple-site');
    const {config} = await createBuildClientConfig({
      props,
      minify: false,
      bundleAnalyzer: false,
    });
    webpack.validate(config);
  });

  it('custom start', async () => {
    const {props} = await loadSetup('custom-site');
    const {clientConfig} = await createStartClientConfig({
      props,
      minify: false,
      poll: false,
    });
    webpack.validate(clientConfig);
  });

  it('custom build', async () => {
    const {props} = await loadSetup('custom-site');
    const {config} = await createBuildClientConfig({
      props,
      minify: false,
      bundleAnalyzer: false,
    });
    webpack.validate(config);
  });
});
