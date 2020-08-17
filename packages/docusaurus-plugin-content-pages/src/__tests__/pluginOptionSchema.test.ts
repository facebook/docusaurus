/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema, DEFAULT_OPTIONS} from '../pluginOptionSchema';
import {PluginOptions} from '../types';

export default function normalizePluginOptions(
  options: Partial<PluginOptions>,
): PluginOptions {
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
  test('should return default options for undefined user options', () => {
    const value = normalizePluginOptions({});
    expect(value).toEqual(DEFAULT_OPTIONS);
  });

  test('should fill in default options for partially defined user options', () => {
    const value = normalizePluginOptions({path: 'src/pages'});
    expect(value).toEqual(DEFAULT_OPTIONS);
  });

  test('should accept correctly defined user options', () => {
    const userOptions = {
      path: 'src/my-pages',
      routeBasePath: 'my-pages',
      include: ['**/*.{js,jsx,ts,tsx}'],
      exclude: ['**/$*/'],
    };
    const value = normalizePluginOptions(userOptions);
    expect(value).toEqual({...DEFAULT_OPTIONS, ...userOptions});
  });

  test('should reject bad path inputs', () => {
    expect(() => {
      normalizePluginOptions({
        // @ts-expect-error: bad attribute
        path: 42,
      });
    }).toThrowErrorMatchingInlineSnapshot(`"\\"path\\" must be a string"`);
  });
});
