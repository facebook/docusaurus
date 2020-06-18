/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema} from '../pluginOptionSchema';
import {PluginOptions} from '../types';

const DEFAULT_OPTIONS: PluginOptions = {
  path: 'src/pages', // Path to data on filesystem, relative to site dir.
  routeBasePath: '', // URL Route.
  include: ['**/*.{js,jsx,ts,tsx}'], // Extensions to include.
};

describe('normalizePluginOptions', () => {
  test('should return default options for undefined user options', async () => {
    let options = await PluginOptionSchema.validate({});
    expect(options).toEqual(DEFAULT_OPTIONS);
  });

  test('should fill in default options for partially defined user options', async () => {
    let options = await PluginOptionSchema.validate({path: 'src/pages'});
    expect(options).toEqual(DEFAULT_OPTIONS);
  });

  test('should reject bad path inputs', () => {
    expect(() => {
      PluginOptionSchema.validateSync({
        path: 2,
      });
    }).toThrow();
  });
});
