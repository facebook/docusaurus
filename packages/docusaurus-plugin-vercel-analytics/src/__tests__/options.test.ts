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

function testValidateOptions(options: Options) {
  return validateOptions({
    validate: normalizePluginOptions as Validate<Options, PluginOptions>,
    options,
  });
}

function validationResult(options: Options) {
  return {
    id: 'default',
    ...DEFAULT_OPTIONS,
    ...options,
  };
}

// const MinimalConfig: Options = {
//   trackingID: 'G-XYZ12345',
// };

describe('validateOptions', () => {
  it('throws for undefined options', () => {
    expect(() => testValidateOptions(undefined)).toEqual(
      validationResult(undefined),
    );
  });

  it('throws for custom id', () => {
    const config: Options = {id: 'custom', mode: 'auto', debug: false};
    expect(() => testValidateOptions(config)).toEqual(validationResult(config));
  });

  it('accept for default id', () => {
    const config: Options = {id: 'default', mode: 'auto', debug: false};
    expect(() => testValidateOptions(config)).toEqual(validationResult(config));
  });

  it('throws for null options', () => {
    expect(
      // @ts-expect-error: TS should error
      () => testValidateOptions(null),
    ).toThrowErrorMatchingInlineSnapshot(`""value" must be of type object"`);
  });

  it('throw for empty object options', () => {
    expect(() => testValidateOptions({})).toThrowErrorMatchingInlineSnapshot(
      `""value" must be of type object"`,
    );
  });

  it('throws for number options', () => {
    expect(
      // @ts-expect-error: TS should error
      () => testValidateOptions(42),
    ).toThrowErrorMatchingInlineSnapshot(`""value" must be of type object"`);
  });

  it('throws for null mode', () => {
    expect(
      // @ts-expect-error: TS should error
      () => testValidateOptions({mode: null}),
    ).toThrowErrorMatchingInlineSnapshot(
      `""mode" must be one of [auto, production, development]"`,
    );
  });
  it('throws for number mode', () => {
    expect(
      // @ts-expect-error: TS should error
      () => testValidateOptions({mode: 42}),
    ).toThrowErrorMatchingInlineSnapshot(
      `""mode" must be one of [auto, production, development]"`,
    );
  });
  it('throws for empty mode', () => {
    expect(() =>
      // @ts-expect-error: TS should error
      testValidateOptions({mode: ''}),
    ).toThrowErrorMatchingInlineSnapshot(
      `""mode" must be one of [auto, production, development]"`,
    );
  });

  // it('accepts minimal config', () => {
  //   expect(testValidateOptions(MinimalConfig)).toEqual(
  //     validationResult(MinimalConfig),
  //   );
  // });

  it('accepts debug true', () => {
    const config: Options = {
      debug: true,
    };
    expect(testValidateOptions(config)).toEqual(validationResult(config));
  });

  it('accepts debug false', () => {
    const config: Options = {
      debug: false,
    };
    expect(testValidateOptions(config)).toEqual(validationResult(config));
  });

  it('accepts mode prod', () => {
    const config: Options = {
      mode: 'production',
      debug: false,
    };
    expect(testValidateOptions(config)).toEqual(validationResult(config));
  });

  it('accepts mode dev', () => {
    const config: Options = {
      mode: 'development',
      debug: false,
    };
    expect(testValidateOptions(config)).toEqual(validationResult(config));
  });
});
