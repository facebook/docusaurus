/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const {
  validateThemeConfig,
  DEFAULT_COLOR_MODE_CONFIG,
  mergeDefault,
} = require('../validateThemeConfig');

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

describe('color mode config', () => {
  test('minimal config', () => {
    const colorMode = {
      switchConfig: {
        darkIcon: '🌙',
      },
    };
    expect(testValidateThemeConfig({colorMode})).toEqual({
      colorMode: mergeDefault(colorMode, DEFAULT_COLOR_MODE_CONFIG),
    });
  });

  test('max config', () => {
    const colorMode = {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
      switchConfig: {
        darkIcon: '🌙',
        darkIconStyle: {
          marginTop: '1px',
          marginLeft: '2px',
        },
        lightIcon: '☀️',
        lightIconStyle: {
          marginLeft: '1px',
        },
      },
    };
    expect(testValidateThemeConfig({colorMode})).toEqual({
      colorMode: mergeDefault(colorMode, DEFAULT_COLOR_MODE_CONFIG),
    });
  });

  test('undefined config', () => {
    const colorMode = undefined;
    expect(testValidateThemeConfig({colorMode})).toEqual({
      colorMode: mergeDefault(colorMode, DEFAULT_COLOR_MODE_CONFIG),
    });
  });

  test('empty config', () => {
    const colorMode = {};
    expect(testValidateThemeConfig({colorMode})).toEqual({
      colorMode: mergeDefault(colorMode, DEFAULT_COLOR_MODE_CONFIG),
    });
  });

  test('empty switch config', () => {
    const colorMode = {
      switchConfig: {},
    };
    expect(testValidateThemeConfig({colorMode})).toEqual({
      colorMode: mergeDefault(colorMode, DEFAULT_COLOR_MODE_CONFIG),
    });
  });
});
