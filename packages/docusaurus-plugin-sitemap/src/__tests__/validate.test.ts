/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema} from '../validation';

test('normalize plugin-content-docs options', async () => {
  let options = await PluginOptionSchema.validate({});
  expect(options).toEqual({
    cacheTime: 600 * 1000, // 600 sec - cache purge period.
    changefreq: 'weekly',
    priority: 0.5,
  });
});
