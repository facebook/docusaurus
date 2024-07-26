/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizePluginOptions} from '@docusaurus/utils-validation';
import {
  validateOptions,
  DEFAULT_OPTIONS,
  type Options,
  type PluginOptions,
} from '../options';
import type {Validate} from '@docusaurus/types';

function testValidate(options: Options) {
  return validateOptions({
    validate: normalizePluginOptions as Validate<Options, PluginOptions>,
    options,
  });
}

const defaultOptions = {
  ...DEFAULT_OPTIONS,
  id: 'default',
};

describe('validateOptions', () => {
  it('returns default values for empty user options', () => {
    expect(testValidate({})).toEqual(defaultOptions);
  });

  it('accepts correctly defined user options', () => {
    const userOptions: Options = {
      changefreq: 'yearly',
      priority: 0.9,
      ignorePatterns: ['/search/**'],
      lastmod: 'datetime',
    };
    expect(testValidate(userOptions)).toEqual({
      ...defaultOptions,
      ...userOptions,
    });
  });

  describe('lastmod', () => {
    it('accepts lastmod undefined', () => {
      const userOptions: Options = {
        lastmod: undefined,
      };
      expect(testValidate(userOptions)).toEqual(defaultOptions);
    });

    it('accepts lastmod null', () => {
      const userOptions: Options = {
        lastmod: null,
      };
      expect(testValidate(userOptions)).toEqual({
        ...defaultOptions,
        ...userOptions,
      });
    });

    it('accepts lastmod datetime', () => {
      const userOptions: Options = {
        lastmod: 'datetime',
      };
      expect(testValidate(userOptions)).toEqual({
        ...defaultOptions,
        ...userOptions,
      });
    });

    it('rejects lastmod bad input', () => {
      const userOptions: Options = {
        // @ts-expect-error: bad value on purpose
        lastmod: 'dateTimeZone',
      };
      expect(() =>
        testValidate(userOptions),
      ).toThrowErrorMatchingInlineSnapshot(
        `""lastmod" must be one of [null, date, datetime]"`,
      );
    });
  });

  describe('priority', () => {
    it('accepts priority undefined', () => {
      const userOptions: Options = {
        priority: undefined,
      };
      expect(testValidate(userOptions)).toEqual(defaultOptions);
    });

    it('accepts priority null', () => {
      const userOptions: Options = {
        priority: null,
      };
      expect(testValidate(userOptions)).toEqual({
        ...defaultOptions,
        ...userOptions,
      });
    });

    it('accepts priority 0', () => {
      const userOptions: Options = {
        priority: 0,
      };
      expect(testValidate(userOptions)).toEqual({
        ...defaultOptions,
        ...userOptions,
      });
    });

    it('accepts priority 0.4', () => {
      const userOptions: Options = {
        priority: 0.4,
      };
      expect(testValidate(userOptions)).toEqual({
        ...defaultOptions,
        ...userOptions,
      });
    });

    it('accepts priority 1', () => {
      const userOptions: Options = {
        priority: 1,
      };
      expect(testValidate(userOptions)).toEqual({
        ...defaultOptions,
        ...userOptions,
      });
    });

    it('rejects priority > 1', () => {
      const userOptions: Options = {
        priority: 2,
      };
      expect(() =>
        testValidate(userOptions),
      ).toThrowErrorMatchingInlineSnapshot(
        `""priority" must be less than or equal to 1"`,
      );
    });

    it('rejects priority < 0', () => {
      const userOptions: Options = {
        priority: -3,
      };
      expect(() =>
        testValidate(userOptions),
      ).toThrowErrorMatchingInlineSnapshot(
        `""priority" must be greater than or equal to 0"`,
      );
    });
  });

  describe('changefreq', () => {
    it('accepts changefreq undefined', () => {
      const userOptions: Options = {
        changefreq: undefined,
      };
      expect(testValidate(userOptions)).toEqual(defaultOptions);
    });

    it('accepts changefreq null', () => {
      const userOptions: Options = {
        changefreq: null,
      };
      expect(testValidate(userOptions)).toEqual({
        ...defaultOptions,
        ...userOptions,
      });
    });

    it('accepts changefreq always', () => {
      const userOptions: Options = {
        changefreq: 'always',
      };
      expect(testValidate(userOptions)).toEqual({
        ...defaultOptions,
        ...userOptions,
      });
    });

    it('rejects changefreq bad inputs', () => {
      const userOptions: Options = {
        // @ts-expect-error: bad value on purpose
        changefreq: 'annually',
      };
      expect(() =>
        testValidate(userOptions),
      ).toThrowErrorMatchingInlineSnapshot(
        `""changefreq" must be one of [null, hourly, daily, weekly, monthly, yearly, always, never]"`,
      );
    });
  });

  describe('ignorePatterns', () => {
    it('accept ignorePatterns undefined', () => {
      const userOptions: Options = {
        ignorePatterns: undefined,
      };
      expect(testValidate(userOptions)).toEqual(defaultOptions);
    });

    it('accept ignorePatterns empty', () => {
      const userOptions: Options = {
        ignorePatterns: [],
      };
      expect(testValidate(userOptions)).toEqual({
        ...defaultOptions,
        ...userOptions,
      });
    });

    it('accept ignorePatterns valid', () => {
      const userOptions: Options = {
        ignorePatterns: ['/tags/**'],
      };
      expect(testValidate(userOptions)).toEqual({
        ...defaultOptions,
        ...userOptions,
      });
    });

    it('rejects ignorePatterns bad input array', () => {
      const userOptions: Options = {
        // @ts-expect-error: test
        ignorePatterns: '/search',
      };
      expect(() =>
        testValidate(userOptions),
      ).toThrowErrorMatchingInlineSnapshot(
        `""ignorePatterns" must be an array"`,
      );
    });

    it('rejects ignorePatterns bad input item string', () => {
      const userOptions: Options = {
        // @ts-expect-error: test
        ignorePatterns: [/^\/search/],
      };
      expect(() =>
        testValidate(userOptions),
      ).toThrowErrorMatchingInlineSnapshot(
        `""ignorePatterns[0]" must be a string"`,
      );
    });
  });

  describe('createSitemapItems', () => {
    it('accept createSitemapItems undefined', () => {
      const userOptions: Options = {
        createSitemapItems: undefined,
      };
      expect(testValidate(userOptions)).toEqual(defaultOptions);
    });

    it('accept createSitemapItems valid', () => {
      const userOptions: Options = {
        createSitemapItems: async (params) => {
          const {defaultCreateSitemapItems, ...rest} = params;
          const sitemapItems = await defaultCreateSitemapItems(rest);
          const sitemapsWithoutPageAndTags = sitemapItems.filter(
            (sitemapItem) =>
              !sitemapItem.url.includes('/tags/') &&
              !sitemapItem.url.includes('/page/'),
          );
          return sitemapsWithoutPageAndTags;
        },
      };
      expect(testValidate(userOptions)).toEqual({
        ...defaultOptions,
        ...userOptions,
      });
    });

    it('rejects createSitemapItems bad input type', () => {
      const userOptions: Options = {
        // @ts-expect-error: test
        createSitemapItems: 'not a function',
      };
      expect(() =>
        testValidate(userOptions),
      ).toThrowErrorMatchingInlineSnapshot(
        `""createSitemapItems" must be of type function"`,
      );
    });
  });
});
