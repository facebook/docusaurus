/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema, DEFAULT_OPTIONS} from '../pluginOptionSchema';

export function normalizePluginOptions(options) {
  const {value, error} = PluginOptionSchema.validate(options, {
    convert: false,
  });
  if (error) {
    throw error;
  } else {
    return value;
  }
}

describe('normalizePagesPluginOptions', () => {
  test('should return default options for undefined user options', async () => {
    const {value} = await PluginOptionSchema.validate({});
    expect(value).toEqual(DEFAULT_OPTIONS);
  });

  test('should fill in default options for partially defined user options', async () => {
    const {value} = await PluginOptionSchema.validate({path: 'src/pages'});
    expect(value).toEqual(DEFAULT_OPTIONS);
  });

  test('should accept correctly defined user options', async () => {
    const userOptions = {
      path: 'src/my-pages',
      routeBasePath: 'my-pages',
      include: ['**/*.{js,jsx,ts,tsx}'],
    };
    const {value} = await PluginOptionSchema.validate(userOptions);
    expect(value).toEqual(userOptions);
  });

  test('should reject bad path inputs', () => {
    expect(() => {
      normalizePluginOptions({
        path: 42,
      });
    }).toThrowErrorMatchingInlineSnapshot(`"\\"path\\" must be a string"`);
  });
});
