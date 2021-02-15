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

const normalizeConfig = (config) => validateConfig({...baseConfig, ...config});

describe('normalizeConfig', () => {
  test('should normalize empty config', () => {
    const value = normalizeConfig({});
    expect(value).toEqual({
      ...DEFAULT_CONFIG,
      ...baseConfig,
    });
  });

  test('should accept correctly defined config options', () => {
    const userConfig = {
      ...DEFAULT_CONFIG,
      ...baseConfig,
      tagline: 'my awesome site',
      organizationName: 'facebook',
      projectName: 'docusaurus',
      githubHost: 'github.com',
      customFields: {
        myCustomField: '42',
      },
      scripts: [
        {
          src: `/analytics.js`,
          async: true,
          defer: true,
          'data-domain': 'xyz', // See https://github.com/facebook/docusaurus/issues/3378
        },
      ],
      stylesheets: [
        {
          href: '/katex/katex.min.css',
          type: 'text/css',
          crossorigin: 'anonymous',
        },
      ],
    };
    const normalizedConfig = normalizeConfig(userConfig);
    expect(normalizedConfig).toEqual(userConfig);
  });

  test('should accept custom field in config', () => {
    const value = normalizeConfig({
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

  test('should throw error for unknown field', () => {
    expect(() => {
      normalizeConfig({
        invalid: true,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('should throw error for baseUrl without trailing `/`', () => {
    expect(() => {
      normalizeConfig({
        baseUrl: 'noslash',
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test.each([
    ['should throw error if plugins is not array', {}],
    [
      'should throw error if plugins is not array',
      function () {
        console.log('noop');
      },
    ],
    [
      "should throw error if plugins is not a string and it's not an array #1",
      [123],
    ],
    [
      "should throw error if plugins is not a string and it's not an array #2",
      [
        function () {
          console.log('noop');
        },
      ],
    ],
    [
      'should throw error if plugins is not an array of [string, object][] #1',
      [['example/path', 'wrong parameter here']],
    ],
    [
      'should throw error if plugins is not an array of [string, object][] #2',
      [[{}, 'example/path']],
    ],
    [
      'should throw error if plugins is not an array of [string, object][] #3',
      [[{}, {}]],
    ],
  ])(`%s for the input of: %p`, (_message, plugins) => {
    expect(() => {
      normalizeConfig({
        plugins,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test.each([
    ['should accept [string] for plugins', ['plain/string']],
    [
      'should accept string[] for plugins',
      ['plain/string', 'another/plain/string/path'],
    ],
    [
      'should accept [string, object] for plugins',
      [['plain/string', {it: 'should work'}]],
    ],
    [
      'should accept [string, object][] for plugins',
      [
        ['plain/string', {it: 'should work'}],
        ['this/should/work', {too: 'yes'}],
      ],
    ],
    [
      'should accept ([string, object]|string)[] for plugins',
      [
        'plain/string',
        ['plain', {it: 'should work'}],
        ['this/should/work', {too: 'yes'}],
      ],
    ],
  ])(`%s for the input of: %p`, (_message, plugins) => {
    expect(() => {
      normalizeConfig({
        plugins,
      });
    }).not.toThrowError();
  });

  test('should throw error if themes is not array', () => {
    expect(() => {
      normalizeConfig({
        themes: {},
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('should throw error if presets is not array', () => {
    expect(() => {
      normalizeConfig({
        presets: {},
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test("should throw error if scripts doesn't have src", () => {
    expect(() => {
      normalizeConfig({
        scripts: ['https://some.com', {}],
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test("should throw error if css doesn't have href", () => {
    expect(() => {
      normalizeConfig({
        stylesheets: ['https://somescript.com', {type: 'text/css'}],
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('should throw error for required fields', () => {
    expect(
      () =>
        validateConfig(({
          invalidField: true,
          presets: {},
          stylesheets: {},
          themes: {},
          scripts: {},
        } as unknown) as DocusaurusConfig), // to fields not in the type
    ).toThrowErrorMatchingSnapshot();
  });
});
