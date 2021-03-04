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
  test('undefined config', () => {
    const liveCodeBlock = undefined;
    expect(testValidateThemeConfig({liveCodeBlock})).toEqual({
      liveCodeBlock: {
        ...DEFAULT_CONFIG,
      },
    });
  });

  test('unexist config', () => {
    expect(testValidateThemeConfig({})).toEqual({
      liveCodeBlock: {
        ...DEFAULT_CONFIG,
      },
    });
  });

  test('empty config', () => {
    const liveCodeBlock = {};
    expect(testValidateThemeConfig({liveCodeBlock})).toEqual({
      liveCodeBlock: {
        ...DEFAULT_CONFIG,
      },
    });
  });

  test('playgroundPosition top', () => {
    const liveCodeBlock = {
      playgroundPosition: 'top',
    };
    expect(testValidateThemeConfig({liveCodeBlock})).toEqual({
      liveCodeBlock: {
        ...DEFAULT_CONFIG,
        ...liveCodeBlock,
      },
    });
  });

  test('playgroundPosition bottom', () => {
    const liveCodeBlock = {
      playgroundPosition: 'bottom',
    };
    expect(testValidateThemeConfig({liveCodeBlock})).toEqual({
      liveCodeBlock: {
        ...DEFAULT_CONFIG,
        ...liveCodeBlock,
      },
    });
  });

  test('playgroundPosition invalid string', () => {
    const liveCodeBlock = {playgroundPosition: 'invalid'};
    expect(() =>
      testValidateThemeConfig({liveCodeBlock}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"liveCodeBlock.playgroundPosition\\" must be one of [top, bottom]"`,
    );
  });
  test('playgroundPosition invalid boolean', () => {
    const liveCodeBlock = {playgroundPosition: true};
    expect(() =>
      testValidateThemeConfig({liveCodeBlock}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"liveCodeBlock.playgroundPosition\\" must be one of [top, bottom]"`,
    );
  });
});
