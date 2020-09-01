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

  test('should throw error if plugins is not array', () => {
    expect(() => {
      normalizeConfig({
        plugins: {},
      });
    }).toThrowErrorMatchingSnapshot();
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
