/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema} from '../pluginOptionSchema';

describe('normalizePluginOptions', () => {
  test('normalize plugin-content-docs options', async () => {
    let options = await PluginOptionSchema.validate({});
    expect(options).toEqual({
      path: 'src/pages',
      routeBasePath: '',
      include: ['**/*.{js,jsx,ts,tsx}'],
    });
  });
});
