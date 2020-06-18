/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema} from '../pluginOptionSchema';
import {PluginOptions} from '../types';

const DEFAULT_OPTIONS: PluginOptions = {
  cacheTime: 600 * 1000, // 600 sec - cache purge period.
  changefreq: 'weekly',
  priority: 0.5,
};

describe('normalizePluginOptions', () => {
  test('should return default values for empty user options', async () => {
    let options = await PluginOptionSchema.validate({});
    expect(options).toEqual(DEFAULT_OPTIONS);
  });

  test('should fill in default options for partially defined user options', async () => {
    let options = await PluginOptionSchema.validate({priority: 0.5});
    expect(options).toEqual(DEFAULT_OPTIONS);
  });

  // test('should reject bad changefreq inputs', () => {
  //   expect(() => {
  //     PluginOptionSchema.validateSync({
  //       changefreq: 2,
  //     });
  //   }).toThrow();
  // });
});
