/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import normalizePluginOptions, {
  DefaultPluginOptions,
} from '../normalizePluginOptions';
import type {CreateRedirectsFnOption} from '@docusaurus/plugin-client-redirects';

describe('normalizePluginOptions', () => {
  it('returns default options for undefined user options', () => {
    expect(normalizePluginOptions()).toEqual(DefaultPluginOptions);
  });

  it('returns default options for empty user options', () => {
    expect(normalizePluginOptions()).toEqual(DefaultPluginOptions);
  });

  it('overrides one default options with valid user options', () => {
    expect(
      normalizePluginOptions({
        toExtensions: ['html'],
      }),
    ).toEqual({...DefaultPluginOptions, toExtensions: ['html']});
  });

  it('overrides all default options with valid user options', () => {
    const createRedirects: CreateRedirectsFnOption = (_routePath: string) => [];
    expect(
      normalizePluginOptions({
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
      normalizePluginOptions({
        fromExtensions: [null, undefined, 123, true] as unknown as string[],
      }),
    ).toThrowErrorMatchingSnapshot();
  });

  it('rejects bad toExtensions user inputs', () => {
    expect(() =>
      normalizePluginOptions({
        toExtensions: [null, undefined, 123, true] as unknown as string[],
      }),
    ).toThrowErrorMatchingSnapshot();
  });

  it('rejects bad createRedirects user inputs', () => {
    expect(() =>
      normalizePluginOptions({
        createRedirects: ['bad', 'value'] as unknown as CreateRedirectsFnOption,
      }),
    ).toThrowErrorMatchingSnapshot();
  });
});
