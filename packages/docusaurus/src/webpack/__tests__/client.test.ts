/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import webpack from 'webpack';

import createClientConfig from '../client';
import {loadSetup} from '../../server/__tests__/testUtils';

describe('webpack dev config', () => {
  it('simple', async () => {
    const props = await loadSetup('simple-site');
    const config = await createClientConfig(props);
    const errors = webpack.validate(config);
    expect(errors).toBeUndefined();
  });

  it('custom', async () => {
    const props = await loadSetup('custom-site');
    const config = await createClientConfig(props);
    const errors = webpack.validate(config);
    expect(errors).toBeUndefined();
  });
});
