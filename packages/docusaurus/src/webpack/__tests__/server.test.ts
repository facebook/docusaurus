/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import webpack from 'webpack';

import createServerConfig from '../server';
import {loadSetup} from '../../server/__tests__/testUtils';

describe('webpack production config', () => {
  it('simple', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const {props} = await loadSetup('simple-site');
    const {config} = await createServerConfig({
      props,
    });
    webpack.validate(config);
  });

  it('custom', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const {props} = await loadSetup('custom-site');
    const {config} = await createServerConfig({
      props,
    });
    webpack.validate(config);
  });
});
