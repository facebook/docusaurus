/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import normalizePluginOptions, {
  DefaultPluginOptions,
} from '../normalizePluginOptions';
import {RedirectsCreator} from '../types';

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
    const createRedirects: RedirectsCreator = (_routePath: string) => {
      return [];
    };
    expect(
      normalizePluginOptions({
        fromExtensions: ['exe', 'zip'],
        toExtensions: ['html'],
        createRedirects,
      }),
    ).toEqual({
      fromExtensions: ['exe', 'zip'],
      toExtensions: ['html'],
      createRedirects,
    });
  });

  test('should reject bad fromExtensions user inputs', () => {
    expect(() =>
      normalizePluginOptions({
        fromExtensions: [null, undefined, 123, true] as any,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "fromExtensions[0] must be a \`string\` type, but the final value was: \`null\`.
       If \\"null\\" is intended as an empty value be sure to mark the schema as \`.nullable()\`"
    `);
  });

  test('should reject bad toExtensions user inputs', () => {
    expect(() =>
      normalizePluginOptions({
        toExtensions: [null, undefined, 123, true] as any,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "toExtensions[0] must be a \`string\` type, but the final value was: \`null\`.
       If \\"null\\" is intended as an empty value be sure to mark the schema as \`.nullable()\`"
    `);
  });

  test('should reject bad createRedirects user inputs', () => {
    expect(() =>
      normalizePluginOptions({
        createRedirects: ['bad', 'value'] as any,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"createRedirects should be a function"`,
    );
  });
});
