/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Joi from '@hapi/joi';
import {ConfigSchema, DEFAULT_CONFIG} from '../configValidation';

describe('validateConfig', () => {
  test('normalize config', () => {
    const value = Joi.attempt(
      {
        baseUrl: '/',
        favicon: 'some.ico',
        title: 'my site',
        url: 'https://mysite.com',
      },
      ConfigSchema,
    );
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
      Joi.attempt(
        {
          baseUrl: '/',
          favicon: 'some.ico',
          title: 'my site',
          url: 'https://mysite.com',
          invalid: true,
        },
        ConfigSchema,
      );
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error for baseUrl without trailing `/`', () => {
    expect(() => {
      Joi.attempt(
        {
          baseUrl: 'noslash',
          favicon: 'some.ico',
          title: 'my site',
          url: 'https://mysite.com',
        },
        ConfigSchema,
      );
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error if plugins is not array', () => {
    expect(() => {
      Joi.attempt(
        {
          baseUrl: '/',
          favicon: 'some.ico',
          title: 'my site',
          url: 'https://mysite.com',

          plugins: {},
        },
        ConfigSchema,
      );
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error if themes is not array', () => {
    expect(() => {
      Joi.attempt(
        {
          baseUrl: '/',
          favicon: 'some.ico',
          title: 'my site',
          url: 'https://mysite.com',

          themes: {},
        },
        ConfigSchema,
      );
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error if presets is not array', () => {
    expect(() => {
      Joi.attempt(
        {
          baseUrl: '/',
          favicon: 'some.ico',
          title: 'my site',
          url: 'https://mysite.com',

          presets: {},
        },
        ConfigSchema,
      );
    }).toThrowErrorMatchingSnapshot();
  });

  test("throw error if scripts doesn't have src", () => {
    expect(() => {
      Joi.attempt(
        {
          baseUrl: '/',
          favicon: 'some.ico',
          title: 'my site',
          url: 'https://mysite.com',

          scripts: ['https://some.com', {}],
        },
        ConfigSchema,
      );
    }).toThrowErrorMatchingSnapshot();
  });

  test("throw error if css doesn't have href", () => {
    expect(() => {
      Joi.attempt(
        {
          baseUrl: '/',
          favicon: 'some.ico',
          title: 'my site',
          url: 'https://mysite.com',

          stylesheets: ['https://somescript.com', {type: 'text/css'}],
        },
        ConfigSchema,
      );
    }).toThrowErrorMatchingSnapshot();
  });

  test('custom field in config', () => {
    const value = Joi.attempt(
      {
        baseUrl: '/',
        favicon: 'some.ico',
        title: 'my site',
        url: 'https://mysite.com',
        customFields: {
          author: 'anshul',
        },
      },
      ConfigSchema,
    );
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
});
