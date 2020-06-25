/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Joi from '@hapi/joi';
import {ConfigSchema, DEFAULT_CONFIG} from '../configValidation';

const testConfig = (config) =>
  Joi.attempt({...DEFAULT_CONFIG, ...config}, ConfigSchema);

describe('validateConfig', () => {
  test('normalize config', () => {
    const value = testConfig({
      baseUrl: '/',
      favicon: 'some.ico',
      title: 'my site',
      url: 'https://mysite.com',
    });
    expect(value).toEqual({
      ...DEFAULT_CONFIG,
      baseUrl: '/',
      favicon: 'some.ico',
      title: 'my site',
      url: 'https://mysite.com',
    });
  });

  test('throw error for unknown field', () => {
    expect(() => {
      testConfig({
        baseUrl: '/',
        favicon: 'some.ico',
        title: 'my site',
        url: 'https://mysite.com',
        invalid: true,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error for baseUrl without trailing `/`', () => {
    expect(() => {
      testConfig({
        baseUrl: 'noslash',
        favicon: 'some.ico',
        title: 'my site',
        url: 'https://mysite.com',
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error if plugins is not array', () => {
    expect(() => {
      testConfig({
        baseUrl: '/',
        favicon: 'some.ico',
        title: 'my site',
        url: 'https://mysite.com',

        plugins: {},
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error if themes is not array', () => {
    expect(() => {
      testConfig({
        baseUrl: '/',
        favicon: 'some.ico',
        title: 'my site',
        url: 'https://mysite.com',

        themes: {},
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error if presets is not array', () => {
    expect(() => {
      testConfig({
        baseUrl: '/',
        favicon: 'some.ico',
        title: 'my site',
        url: 'https://mysite.com',

        presets: {},
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test("throw error if scripts doesn't have src", () => {
    expect(() => {
      testConfig({
        baseUrl: '/',
        favicon: 'some.ico',
        title: 'my site',
        url: 'https://mysite.com',

        scripts: ['https://some.com', {}],
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test("throw error if css doesn't have href", () => {
    expect(() => {
      testConfig({
        baseUrl: '/',
        favicon: 'some.ico',
        title: 'my site',
        url: 'https://mysite.com',

        stylesheets: ['https://somescript.com', {type: 'text/css'}],
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('custom field in config', () => {
    const value = testConfig({
      baseUrl: '/',
      favicon: 'some.ico',
      title: 'my site',
      url: 'https://mysite.com',
      customFields: {
        author: 'anshul',
      },
    });
    expect(value).toEqual({
      ...DEFAULT_CONFIG,
      baseUrl: '/',
      favicon: 'some.ico',
      title: 'my site',
      url: 'https://mysite.com',
      customFields: {
        author: 'anshul',
      },
    });
  });

  test('throw error for required fields', () => {
    expect(() => testConfig({})).toThrowErrorMatchingSnapshot();
  });
});
