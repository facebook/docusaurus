/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validateThemeConfig} from '../validateThemeConfig';
import type {Joi} from '@docusaurus/utils-validation';

function testValidateThemeConfig(themeConfig: {[key: string]: unknown}) {
  function validate(
    schema: Joi.ObjectSchema<{[key: string]: unknown}>,
    cfg: {[key: string]: unknown},
  ) {
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
  it('undefined config', () => {
    const mermaid = undefined;
    expect(testValidateThemeConfig({mermaid})).toEqual({});
  });

  it('nonexistent config', () => {
    expect(testValidateThemeConfig({})).toEqual({});
  });

  it('empty config', () => {
    const mermaid = {};
    expect(testValidateThemeConfig({mermaid})).toEqual({
      mermaid: {},
    });
  });

  it('theme', () => {
    const mermaid = {
      theme: {
        light: 'light',
        dark: 'dark',
      },
    };
    expect(testValidateThemeConfig({mermaid})).toEqual({
      mermaid: {
        ...mermaid,
      },
    });
  });

  it('config', () => {
    const mermaid = {
      config: {
        fontFamily: 'Ariel',
      },
    };
    expect(testValidateThemeConfig({mermaid})).toEqual({
      mermaid: {
        ...mermaid,
      },
    });
  });
});
