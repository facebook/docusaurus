/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema, DEFAULT_OPTIONS} from '../pluginOptionSchema';

function normalizePluginOptions(options) {
  const {value, error} = PluginOptionSchema.validate(options, {
    convert: false,
  });
  if (error) {
    throw error;
  } else {
    return value;
  }
}

describe('normalizeSitemapPluginOptions', () => {
  test('should return default values for empty user options', async () => {
    const {value} = await PluginOptionSchema.validate({});
    expect(value).toEqual(DEFAULT_OPTIONS);
  });

  test('should accept correctly defined user options', async () => {
    const userOptions = {
      changefreq: 'yearly',
      priority: 0.9,
      trailingSlash: false,
    };
    const {value} = await PluginOptionSchema.validate(userOptions);
    expect(value).toEqual(userOptions);
  });

  test('should reject out-of-range priority inputs', () => {
    expect(() => {
      normalizePluginOptions({
        priority: 2,
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"priority\\" must be less than or equal to 1"`,
    );
  });

  test('should reject bad changefreq inputs', () => {
    expect(() => {
      normalizePluginOptions({
        changefreq: 'annually',
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"changefreq\\" must be one of [daily, monthly, always, hourly, weekly, yearly, never]"`,
    );
  });
});
