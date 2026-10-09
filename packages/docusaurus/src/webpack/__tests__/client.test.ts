/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, it} from 'vitest';
import webpack from 'webpack';

import {createBuildClientConfig, createStartClientConfig} from '../client';
import {loadWebpackSiteFixture} from '../../server/__tests__/testUtils';
import {createConfigureWebpackUtils} from '../configure';

function createTestConfigureWebpackUtils() {
  return createConfigureWebpackUtils({
    siteConfig: {webpack: {jsLoader: 'babel'}},
  });
}

describe('webpack dev config', () => {
  it('simple start', async () => {
    const {props} = await loadWebpackSiteFixture('simple-site');
    const {clientConfig} = await createStartClientConfig({
      props,
      configureWebpackUtils: await createTestConfigureWebpackUtils(),
      minify: false,
      poll: false,
    });
    webpack.validate(clientConfig);
  });

  it('simple build', async () => {
    const {props} = await loadWebpackSiteFixture('simple-site');
    const {config} = await createBuildClientConfig({
      props,
      configureWebpackUtils: await createTestConfigureWebpackUtils(),
      minify: false,
    });
    webpack.validate(config);
  });

  it('custom start', async () => {
    const {props} = await loadWebpackSiteFixture('custom-site');
    const {clientConfig} = await createStartClientConfig({
      props,
      configureWebpackUtils: await createTestConfigureWebpackUtils(),
      minify: false,
      poll: false,
    });
    webpack.validate(clientConfig);
  });

  it('custom build', async () => {
    const {props} = await loadWebpackSiteFixture('custom-site');
    const {config} = await createBuildClientConfig({
      props,
      configureWebpackUtils: await createTestConfigureWebpackUtils(),
      minify: false,
    });
    webpack.validate(config);
  });
});
