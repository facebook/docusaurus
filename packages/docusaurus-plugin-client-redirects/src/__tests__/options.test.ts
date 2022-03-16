/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validateOptions, DEFAULT_OPTIONS} from '../options';
import {normalizePluginOptions} from '@docusaurus/utils-validation';
import type {
  CreateRedirectsFnOption,
  Options,
} from '@docusaurus/plugin-client-redirects';

function testValidate(options: Options) {
  return validateOptions({validate: normalizePluginOptions, options});
}

describe('normalizePluginOptions', () => {
  it('returns default options for undefined user options', () => {
    expect(testValidate(undefined)).toEqual(DEFAULT_OPTIONS);
  });

  it('returns default options for empty user options', () => {
    expect(testValidate(undefined)).toEqual(DEFAULT_OPTIONS);
  });

  it('overrides one default options with valid user options', () => {
    expect(
      testValidate({
        toExtensions: ['html'],
      }),
    ).toEqual({...DEFAULT_OPTIONS, id: 'default', toExtensions: ['html']});
  });

  it('overrides all default options with valid user options', () => {
    const createRedirects: CreateRedirectsFnOption = (_routePath: string) => [];
    expect(
      testValidate({
        fromExtensions: ['exe', 'zip'],
        toExtensions: ['html'],
        createRedirects,
        redirects: [{from: '/x', to: '/y'}],
      }),
    ).toEqual({
      id: 'default',
      fromExtensions: ['exe', 'zip'],
      toExtensions: ['html'],
      createRedirects,
      redirects: [{from: '/x', to: '/y'}],
    });
  });

  it('rejects bad fromExtensions user inputs', () => {
    expect(() =>
      testValidate({
        fromExtensions: [null, undefined, 123, true] as unknown as string[],
      }),
    ).toThrowErrorMatchingSnapshot();
  });

  it('rejects bad toExtensions user inputs', () => {
    expect(() =>
      testValidate({
        toExtensions: [null, undefined, 123, true] as unknown as string[],
      }),
    ).toThrowErrorMatchingSnapshot();
  });

  it('rejects bad createRedirects user inputs', () => {
    expect(() =>
      testValidate({
        createRedirects: ['bad', 'value'] as unknown as CreateRedirectsFnOption,
      }),
    ).toThrowErrorMatchingSnapshot();
  });
});
