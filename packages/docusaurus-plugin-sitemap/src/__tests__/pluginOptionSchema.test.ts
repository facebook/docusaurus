/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema} from '../pluginOptionSchema';

describe('normalizePluginOptions', () => {
  test('should return default values for empty user options', async () => {
    let options = await PluginOptionSchema.validate({});
    expect(options).toEqual({
      cacheTime: 600 * 1000,
      changefreq: 'weekly',
      priority: 0.5,
    });
  });
});
