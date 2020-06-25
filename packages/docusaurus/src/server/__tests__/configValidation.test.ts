/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DEFAULT_CONFIG, validateConfig} from '../configValidation';
import {DocusaurusConfig} from '@docusaurus/types';

const baseConfig = {
  baseUrl: '/',
  favicon: 'some.ico',
  title: 'my site',
  url: 'https://mysite.com',
};

const testConfig = (config) => validateConfig({...baseConfig, ...config});

describe('validateConfig', () => {
  test('normalize config', () => {
    const value = testConfig({});
    expect(value).toEqual({
      ...DEFAULT_CONFIG,
      ...baseConfig,
    });
  });

  test('throw error for unknown field', () => {
    expect(() => {
      testConfig({
        invalid: true,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error for baseUrl without trailing `/`', () => {
    expect(() => {
      testConfig({
        baseUrl: 'noslash',
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error if plugins is not array', () => {
    expect(() => {
      testConfig({
        plugins: {},
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error if themes is not array', () => {
    expect(() => {
      testConfig({
        themes: {},
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error if presets is not array', () => {
    expect(() => {
      testConfig({
        presets: {},
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test("throw error if scripts doesn't have src", () => {
    expect(() => {
      testConfig({
        scripts: ['https://some.com', {}],
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test("throw error if css doesn't have href", () => {
    expect(() => {
      testConfig({
        stylesheets: ['https://somescript.com', {type: 'text/css'}],
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('custom field in config', () => {
    const value = testConfig({
      customFields: {
        author: 'anshul',
      },
    });
    expect(value).toEqual({
      ...DEFAULT_CONFIG,
      ...baseConfig,
      customFields: {
        author: 'anshul',
      },
    });
  });

  test('throw error for required fields', () => {
    expect(
      () =>
        validateConfig(({
          invalid: true,
          preset: {},
          stylesheets: {},
          themes: {},
          scripts: {},
        } as unknown) as DocusaurusConfig), // to fields not in the type
    ).toThrowErrorMatchingSnapshot();
  });
});
