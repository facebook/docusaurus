/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import normalizePluginOptions, {
  DefaultPluginOptions,
} from '../normalizePluginOptions';
import {CreateRedirectsFnOption} from '../types';

describe('normalizePluginOptions', () => {
  test('should return default options for undefined user options', () => {
    expect(normalizePluginOptions()).toEqual(DefaultPluginOptions);
  });

  test('should return default options for empty user options', () => {
    expect(normalizePluginOptions()).toEqual(DefaultPluginOptions);
  });

  test('should override one default options with valid user options', () => {
    expect(
      normalizePluginOptions({
        toExtensions: ['html'],
      }),
    ).toEqual({...DefaultPluginOptions, toExtensions: ['html']});
  });

  test('should override all default options with valid user options', () => {
    const createRedirects: CreateRedirectsFnOption = (_routePath: string) => {
      return [];
    };
    expect(
      normalizePluginOptions({
        fromExtensions: ['exe', 'zip'],
        toExtensions: ['html'],
        createRedirects,
        redirects: [{from: '/x', to: '/y'}],
      }),
    ).toEqual({
      fromExtensions: ['exe', 'zip'],
      toExtensions: ['html'],
      createRedirects,
      redirects: [{from: '/x', to: '/y'}],
    });
  });

  test('should reject bad fromExtensions user inputs', () => {
    expect(() =>
      normalizePluginOptions({
        fromExtensions: ([null, undefined, 123, true] as unknown) as string[],
      }),
    ).toThrowErrorMatchingSnapshot();
  });

  test('should reject bad toExtensions user inputs', () => {
    expect(() =>
      normalizePluginOptions({
        toExtensions: ([null, undefined, 123, true] as unknown) as string[],
      }),
    ).toThrowErrorMatchingSnapshot();
  });

  test('should reject bad createRedirects user inputs', () => {
    expect(() =>
      normalizePluginOptions({
        createRedirects: ([
          'bad',
          'value',
        ] as unknown) as CreateRedirectsFnOption,
      }),
    ).toThrowErrorMatchingSnapshot();
  });
});
