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
  it('returns default values for empty user options', () => {
    const {value} = PluginOptionSchema.validate({});
    expect(value).toEqual(DEFAULT_OPTIONS);
  });

  it('accepts correctly defined user options', () => {
    const userOptions = {
      changefreq: 'yearly',
      priority: 0.9,
    };
    const {value} = PluginOptionSchema.validate(userOptions);
    expect(value).toEqual(userOptions);
  });

  it('rejects out-of-range priority inputs', () => {
    expect(() => {
      normalizePluginOptions({
        priority: 2,
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"priority\\" must be less than or equal to 1"`,
    );
  });

  it('rejects bad changefreq inputs', () => {
    expect(() => {
      normalizePluginOptions({
        changefreq: 'annually',
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"changefreq\\" must be one of [daily, monthly, always, hourly, weekly, yearly, never]"`,
    );
  });
});
