/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, it} from 'vitest';
import webpack from 'webpack';

import createServerConfig from '../server';
import {loadWebpackSiteFixture} from '../../server/__tests__/testUtils';
import {createConfigureWebpackUtils} from '../configure';
import {
  DEFAULT_FASTER_CONFIG_FALSE,
  DEFAULT_FUTURE_CONFIG,
} from '../../server/configValidation';

function createTestConfigureWebpackUtils() {
  return createConfigureWebpackUtils({
    siteConfig: {
      webpack: {jsLoader: 'babel'},
      future: {...DEFAULT_FUTURE_CONFIG, faster: DEFAULT_FASTER_CONFIG_FALSE},
    },
  });
}

describe('webpack production config', () => {
  it('simple', async () => {
    const {props} = await loadWebpackSiteFixture('simple-site');
    const {config} = await createServerConfig({
      props,
      configureWebpackUtils: await createTestConfigureWebpackUtils(),
    });
    webpack.validate(config);
  });

  it('custom', async () => {
    const {props} = await loadWebpackSiteFixture('custom-site');
    const {config} = await createServerConfig({
      props,
      configureWebpackUtils: await createTestConfigureWebpackUtils(),
    });
    webpack.validate(config);
  });
});
