/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizePluginOptions} from '@docusaurus/utils-validation';
import {
  validateOptions,
  type PluginOptions,
  type Options,
  DEFAULT_OPTIONS,
} from '../options';
import type {Validate} from '@docusaurus/types';

function validate(options?: Options) {
  return validateOptions({
    validate: normalizePluginOptions as Validate<
      Options | undefined,
      PluginOptions
    >,
    options,
  });
}

function result(options?: Options) {
  return {
    id: 'default',
    ...DEFAULT_OPTIONS,
    ...options,
  };
}

describe('validateOptions', () => {
  it('accepts undefined', () => {
    expect(validate(undefined)).toEqual(result(DEFAULT_OPTIONS));
  });

  it('accepts empty object', () => {
    expect(validate({})).toEqual(result(DEFAULT_OPTIONS));
  });

  it('accepts defaults', () => {
    expect(validate(DEFAULT_OPTIONS)).toEqual(result(DEFAULT_OPTIONS));
  });

  it('rejects null', () => {
    expect(
      // @ts-expect-error: TS should error
      () => validate(null),
    ).toThrowErrorMatchingInlineSnapshot(`""value" must be of type object"`);
  });

  it('rejects number', () => {
    expect(
      // @ts-expect-error: TS should error
      () => validate(42),
    ).toThrowErrorMatchingInlineSnapshot(`""value" must be of type object"`);
  });

  describe('rsdoctorOptions', () => {
    it('accepts undefined', () => {
      expect(validate({rsdoctorOptions: undefined})).toEqual(
        result(DEFAULT_OPTIONS),
      );
    });

    it('accepts empty', () => {
      expect(validate({rsdoctorOptions: {}})).toEqual(result(DEFAULT_OPTIONS));
    });

    it('accepts any record', () => {
      expect(
        validate({rsdoctorOptions: {any: 'value', evenNumbers: 42}}),
      ).toEqual(
        result({
          ...DEFAULT_OPTIONS,
          rsdoctorOptions: {
            any: 'value',
            evenNumbers: 42,
          },
        }),
      );
    });

    it('accepts default', () => {
      expect(
        validate({rsdoctorOptions: DEFAULT_OPTIONS.rsdoctorOptions}),
      ).toEqual(result(DEFAULT_OPTIONS));
    });

    it('rejects number values', () => {
      expect(() =>
        // @ts-expect-error: invalid type
        validate({rsdoctorOptions: 42}),
      ).toThrowErrorMatchingInlineSnapshot(
        `""rsdoctorOptions" must be of type object"`,
      );
    });
  });
});
