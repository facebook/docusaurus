/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {validateThemeConfig, DEFAULT_CONFIG} = require('../validateThemeConfig');

function testValidateThemeConfig(themeConfig) {
  function validate(schema, cfg) {
    const {value, error} = schema.validate(cfg, {
      convert: false,
    });
    if (error) {
      throw error;
    }
    return value;
  }

  return validateThemeConfig({themeConfig, validate});
}

describe('validateThemeConfig', () => {
  test('minimal config', () => {
    const algolia = {
      indexName: 'index',
      apiKey: 'apiKey',
    };
    expect(testValidateThemeConfig({algolia})).toEqual({
      algolia: {
        ...DEFAULT_CONFIG,
        ...algolia,
      },
    });
  });

  test('unknown attributes', () => {
    const algolia = {
      indexName: 'index',
      apiKey: 'apiKey',
      unknownKey: 'unknownKey',
    };
    expect(testValidateThemeConfig({algolia})).toEqual({
      algolia: {
        ...DEFAULT_CONFIG,
        ...algolia,
      },
    });
  });

  test('undefined config', () => {
    const algolia = undefined;
    expect(() =>
      testValidateThemeConfig({algolia}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"themeConfig.algolia\\" is required"`,
    );
  });

  test('undefined config 2', () => {
    expect(() =>
      testValidateThemeConfig({}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"themeConfig.algolia\\" is required"`,
    );
  });

  test('empty config', () => {
    const algolia = {};
    expect(() =>
      testValidateThemeConfig({algolia}),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"algolia.apiKey\\" is required"`);
  });

  test('missing indexName config', () => {
    const algolia = {apiKey: 'apiKey'};
    expect(() =>
      testValidateThemeConfig({algolia}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"algolia.indexName\\" is required"`,
    );
  });

  test('missing apiKey config', () => {
    const algolia = {indexName: 'indexName'};
    expect(() =>
      testValidateThemeConfig({algolia}),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"algolia.apiKey\\" is required"`);
  });
});
