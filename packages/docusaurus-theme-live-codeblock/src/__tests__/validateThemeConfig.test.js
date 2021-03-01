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

  return validateThemeConfig({validate, themeConfig});
}

describe('validateThemeConfig', () => {
  test('minimal config', () => {
    const liveCodeblock = {
      showResultBeforeEditor: true,
    };
    expect(testValidateThemeConfig({liveCodeblock})).toEqual({
      liveCodeblock: {
        ...DEFAULT_CONFIG,
        ...liveCodeblock,
      },
    });
  });

  test('undefined config 1', () => {
    const liveCodeblock = undefined;
    expect(testValidateThemeConfig({liveCodeblock})).toEqual({
      liveCodeblock: {
        ...DEFAULT_CONFIG,
      },
    });
  });

  test('unexist config', () => {
    expect(testValidateThemeConfig({})).toEqual({
      liveCodeblock: {
        ...DEFAULT_CONFIG,
      },
    });
  });

  test('empty config', () => {
    const liveCodeblock = {};
    expect(testValidateThemeConfig({liveCodeblock})).toEqual({
      liveCodeblock: {
        ...DEFAULT_CONFIG,
      },
    });
  });

  test('showResultBeforeEditor not a boolean', () => {
    const liveCodeblock = {showResultBeforeEditor: 'invalid'};
    expect(() =>
      testValidateThemeConfig({liveCodeblock}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"liveCodeblock.showResultBeforeEditor\\" must be a boolean"`,
    );
  });
});
