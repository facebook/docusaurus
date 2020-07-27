/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {validateOptions, DEFAULT_OPTIONS} = require('../validateOptions');

function testValidateOptions(options) {
  function validate(schema, opt) {
    const {value, error} = schema.validate(opt, {
      convert: false,
    });
    if (error) {
      throw error;
    } else {
      return value;
    }
  }

  return validateOptions({options, validate});
}

describe('validateOptions', () => {
  test('minimal config', () => {
    const options = {
      indexName: 'index',
      apiKey: 'apiKey',
    };
    expect(testValidateOptions(options)).toEqual({
      ...DEFAULT_OPTIONS,
      ...options,
    });
  });

  test('unknown attributes', () => {
    const options = {
      indexName: 'index',
      apiKey: 'apiKey',
      unknownKey: 'unknownKey',
    };
    expect(testValidateOptions(options)).toEqual({
      ...DEFAULT_OPTIONS,
      ...options,
    });
  });

  test('undefined config', () => {
    const options = undefined;
    expect(() =>
      testValidateOptions(options),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"Algolia theme config\\" is required"`,
    );
  });

  test('empty config', () => {
    const options = {};
    expect(() =>
      testValidateOptions(options),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"apiKey\\" is required"`);
  });

  test('missing indexName config', () => {
    const options = {apiKey: 'apiKey'};
    expect(() =>
      testValidateOptions(options),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"indexName\\" is required"`);
  });

  test('missing apiKey config', () => {
    const options = {indexName: 'indexName'};
    expect(() =>
      testValidateOptions(options),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"apiKey\\" is required"`);
  });
});
