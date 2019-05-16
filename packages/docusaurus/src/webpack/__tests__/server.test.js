/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validate} from 'webpack';

import createServerConfig from '../server';
import loadSetup from '../../server/load/loadSetup';

describe('webpack production config', () => {
  test('simple', async () => {
    console.log = jest.fn();
    const props = await loadSetup('simple');
    const config = createServerConfig(props);
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });

  test('custom', async () => {
    console.log = jest.fn();
    const props = await loadSetup('custom');
    const config = createServerConfig(props);
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });
});
