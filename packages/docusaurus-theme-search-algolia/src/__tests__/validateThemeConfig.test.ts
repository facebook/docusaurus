/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// mock docsearch to a v4 version to allow AskAI tests to pass
import {DEFAULT_CONFIG, validateThemeConfig} from '../validateThemeConfig';
import type {Joi} from '@docusaurus/utils-validation';

jest.mock('@docsearch/react', () => ({version: '4.0.0'}));

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

  return validateThemeConfig({themeConfig, validate});
}

describe('validateThemeConfig', () => {
  it('minimal config', () => {
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

  it('unknown attributes', () => {
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

  it('undefined config', () => {
    const algolia = undefined;
    expect(() =>
      testValidateThemeConfig({algolia}),
    ).toThrowErrorMatchingInlineSnapshot(`""themeConfig.algolia" is required"`);
  });

  it('undefined config 2', () => {
    expect(() =>
      testValidateThemeConfig({}),
    ).toThrowErrorMatchingInlineSnapshot(`""themeConfig.algolia" is required"`);
  });

  it('missing indexName config', () => {
    const algolia = {apiKey: 'apiKey', appId: 'BH4D9OD16A'};
    expect(() =>
      testValidateThemeConfig({algolia}),
    ).toThrowErrorMatchingInlineSnapshot(`""algolia.indexName" is required"`);
  });

  it('missing apiKey config', () => {
    const algolia = {indexName: 'indexName', appId: 'BH4D9OD16A'};
    expect(() =>
      testValidateThemeConfig({algolia}),
    ).toThrowErrorMatchingInlineSnapshot(`""algolia.apiKey" is required"`);
  });

  it('missing appId config', () => {
    const algolia = {indexName: 'indexName', apiKey: 'apiKey'};
    expect(() =>
      testValidateThemeConfig({algolia}),
    ).toThrowErrorMatchingInlineSnapshot(
      `""algolia.appId" is required. If you haven't migrated to the new DocSearch infra, please refer to the blog post for instructions: https://docusaurus.io/blog/2021/11/21/algolia-docsearch-migration"`,
    );
  });

  it('contextualSearch config', () => {
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

  it('externalUrlRegex config', () => {
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

  describe('replaceSearchResultPathname', () => {
    it('escapes from string', () => {
      const algolia = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        replaceSearchResultPathname: {
          from: '/docs/some-\\special-.[regexp]{chars*}',
          to: '/abc',
        },
      };
      expect(testValidateThemeConfig({algolia})).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
          replaceSearchResultPathname: {
            from: '/docs/some\\x2d\\\\special\\x2d\\.\\[regexp\\]\\{chars\\*\\}',
            to: '/abc',
          },
        },
      });
    });

    it('converts from regexp to string', () => {
      const algolia = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        replaceSearchResultPathname: {
          from: /^\/docs\/(?:1\.0|next)/,
          to: '/abc',
        },
      };

      expect(testValidateThemeConfig({algolia})).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
          replaceSearchResultPathname: {
            from: '^\\/docs\\/(?:1\\.0|next)',
            to: '/abc',
          },
        },
      });
    });
  });

  it('searchParameters.facetFilters search config', () => {
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

  describe('askAi config validation', () => {
    it('accepts string format (assistantId)', () => {
      const algolia = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        askAi: 'my-assistant-id',
      };
      expect(testValidateThemeConfig({algolia})).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
          askAi: {
            indexName: 'index',
            apiKey: 'apiKey',
            appId: 'BH4D9OD16A',
            assistantId: 'my-assistant-id',
          },
        },
      });
    });

    it('accepts full object format', () => {
      const algolia = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        askAi: {
          indexName: 'ai-index',
          apiKey: 'ai-apiKey',
          appId: 'ai-appId',
          assistantId: 'my-assistant-id',
        },
      };
      expect(testValidateThemeConfig({algolia})).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
        },
      });
    });

    it('rejects invalid type', () => {
      const algolia = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        askAi: 123, // Invalid: should be string or object
      };
      expect(() =>
        testValidateThemeConfig({algolia}),
      ).toThrowErrorMatchingInlineSnapshot(
        `"askAi must be either a string (assistantId) or an object with indexName, apiKey, appId, and assistantId"`,
      );
    });

    it('rejects object missing required fields', () => {
      const algolia = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        askAi: {
          assistantId: 'my-assistant-id',
          // Missing indexName, apiKey, appId
        },
      };
      expect(() =>
        testValidateThemeConfig({algolia}),
      ).toThrowErrorMatchingInlineSnapshot(
        `""algolia.askAi.indexName" is required"`,
      );
    });

    it('accepts undefined askAi', () => {
      const algolia = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
      };
      expect(testValidateThemeConfig({algolia})).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
        },
      });
    });
  });
});
