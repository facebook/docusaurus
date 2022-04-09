/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validateOptions, DEFAULT_OPTIONS} from '../options';
import {normalizePluginOptions} from '@docusaurus/utils-validation';
import type {Options} from '@docusaurus/plugin-sitemap';

function testValidate(options: Options) {
  return validateOptions({validate: normalizePluginOptions, options});
}

const defaultOptions = {
  ...DEFAULT_OPTIONS,
  id: 'default',
};

describe('validateOptions', () => {
  it('returns default values for empty user options', () => {
    expect(testValidate({})).toEqual(defaultOptions);
  });

  it('accepts correctly defined user options', () => {
    const userOptions = {
      changefreq: 'yearly',
      priority: 0.9,
      ignorePatterns: ['/search/**'],
    };
    expect(testValidate(userOptions)).toEqual({
      ...defaultOptions,
      ...userOptions,
    });
  });

  it('rejects out-of-range priority inputs', () => {
    expect(() =>
      testValidate({priority: 2}),
    ).toThrowErrorMatchingInlineSnapshot(
      `""priority" must be less than or equal to 1"`,
    );
  });

  it('rejects bad changefreq inputs', () => {
    expect(() =>
      testValidate({changefreq: 'annually'}),
    ).toThrowErrorMatchingInlineSnapshot(
      `""changefreq" must be one of [daily, monthly, always, hourly, weekly, yearly, never]"`,
    );
  });

  it('rejects bad ignorePatterns inputs', () => {
    expect(() =>
      testValidate({ignorePatterns: '/search'}),
    ).toThrowErrorMatchingInlineSnapshot(`""ignorePatterns" must be an array"`);
    expect(() =>
      testValidate({ignorePatterns: [/^\/search/]}),
    ).toThrowErrorMatchingInlineSnapshot(
      `""ignorePatterns[0]" must be a string"`,
    );
  });
});
