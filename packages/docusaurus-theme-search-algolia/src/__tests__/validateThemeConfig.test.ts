/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Joi} from '@docusaurus/utils-validation';
import {validateThemeConfig, DEFAULT_CONFIG} from '../validateThemeConfig';

function testValidateThemeConfig(themeConfig: Record<string, unknown>) {
  function validate(schema: Joi.Schema, cfg: Record<string, unknown>) {
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

describe('validateThemeConfig', () => {
  test('minimal config', () => {
    const algolia = {
      indexName: 'index',
      apiKey: 'apiKey',
      appId: 'BH4D9OD16A',
    };
    expect(testValidateThemeConfig({algolia})).toEqual({
      algolia: {
        ...DEFAULT_CONFIG,
        ...algolia,
      },
    });
  });

  test('unknown attributes', () => {
    const algolia = {
      indexName: 'index',
      apiKey: 'apiKey',
      unknownKey: 'unknownKey',
      appId: 'BH4D9OD16A',
    };
    expect(testValidateThemeConfig({algolia})).toEqual({
      algolia: {
        ...DEFAULT_CONFIG,
        ...algolia,
      },
    });
  });

  test('undefined config', () => {
    const algolia = undefined;
    expect(() =>
      testValidateThemeConfig({algolia}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"themeConfig.algolia\\" is required"`,
    );
  });

  test('undefined config 2', () => {
    expect(() =>
      testValidateThemeConfig({}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"themeConfig.algolia\\" is required"`,
    );
  });

  test('missing indexName config', () => {
    const algolia = {apiKey: 'apiKey', appId: 'BH4D9OD16A'};
    expect(() =>
      testValidateThemeConfig({algolia}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"algolia.indexName\\" is required"`,
    );
  });

  test('missing apiKey config', () => {
    const algolia = {indexName: 'indexName', appId: 'BH4D9OD16A'};
    expect(() =>
      testValidateThemeConfig({algolia}),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"algolia.apiKey\\" is required"`);
  });

  test('missing appId config', () => {
    const algolia = {indexName: 'indexName', apiKey: 'apiKey'};
    expect(() =>
      testValidateThemeConfig({algolia}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"algolia.appId\\" is required. If you haven't migrated to the new DocSearch infra, please refer to the blog post for instructions: https://docusaurus.io/blog/2021/11/21/algolia-docsearch-migration"`,
    );
  });

  test('contextualSearch config', () => {
    const algolia = {
      appId: 'BH4D9OD16A',
      indexName: 'index',
      apiKey: 'apiKey',
      contextualSearch: true,
    };
    expect(testValidateThemeConfig({algolia})).toEqual({
      algolia: {
        ...DEFAULT_CONFIG,
        ...algolia,
      },
    });
  });

  test('externalUrlRegex config', () => {
    const algolia = {
      appId: 'BH4D9OD16A',
      indexName: 'index',
      apiKey: 'apiKey',
      externalUrlRegex: 'http://external-domain.com',
    };
    expect(testValidateThemeConfig({algolia})).toEqual({
      algolia: {
        ...DEFAULT_CONFIG,
        ...algolia,
      },
    });
  });

  test('searchParameters.facetFilters search config', () => {
    const algolia = {
      appId: 'BH4D9OD16A',
      indexName: 'index',
      apiKey: 'apiKey',
      searchParameters: {
        facetFilters: ['version:1.0'],
      },
    };
    expect(testValidateThemeConfig({algolia})).toEqual({
      algolia: {
        ...DEFAULT_CONFIG,
        ...algolia,
      },
    });
  });
});
