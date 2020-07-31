/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import merge from 'lodash/merge';

const {
  validateThemeConfig,
  DEFAULT_COLOR_MODE_CONFIG,
} = require('../validateThemeConfig');

const mergeDefault = (config) => merge({}, DEFAULT_COLOR_MODE_CONFIG, config);

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
      colorMode: mergeDefault(colorMode),
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
      colorMode: mergeDefault(colorMode),
    });
  });

  test('undefined config', () => {
    const colorMode = undefined;
    expect(testValidateThemeConfig({colorMode})).toEqual({
      colorMode: mergeDefault(colorMode),
    });
  });

  test('empty config', () => {
    const colorMode = {};
    expect(testValidateThemeConfig({colorMode})).toEqual({
      colorMode: mergeDefault(colorMode),
    });
  });

  test('empty switch config', () => {
    const colorMode = {
      switchConfig: {},
    };
    expect(testValidateThemeConfig({colorMode})).toEqual({
      colorMode: mergeDefault(colorMode),
    });
  });
});
