/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizePluginOptions} from '@docusaurus/utils-validation';
import {
  validateOptions,
  DEFAULT_OPTIONS,
  type Options,
  type PluginOptions,
} from '../options';
import type {EnumChangefreq} from 'sitemap';
import type {Validate} from '@docusaurus/types';

function testValidate(options: Options) {
  return validateOptions({
    validate: normalizePluginOptions as Validate<Options, PluginOptions>,
    options,
  });
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
    const userOptions: Options = {
      changefreq: 'yearly' as EnumChangefreq,
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
      testValidate({changefreq: 'annually' as EnumChangefreq}),
    ).toThrowErrorMatchingInlineSnapshot(
      `""changefreq" must be one of [daily, monthly, always, hourly, weekly, yearly, never]"`,
    );
  });

  it('rejects bad ignorePatterns inputs', () => {
    expect(() =>
      // @ts-expect-error: test
      testValidate({ignorePatterns: '/search'}),
    ).toThrowErrorMatchingInlineSnapshot(`""ignorePatterns" must be an array"`);
    expect(() =>
      // @ts-expect-error: test
      testValidate({ignorePatterns: [/^\/search/]}),
    ).toThrowErrorMatchingInlineSnapshot(
      `""ignorePatterns[0]" must be a string"`,
    );
  });
});
