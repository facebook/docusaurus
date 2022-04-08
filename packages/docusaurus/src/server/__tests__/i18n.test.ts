/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import {loadI18n, getDefaultLocaleConfig} from '../i18n';
import {DEFAULT_I18N_CONFIG} from '../configValidation';
import type {I18nConfig} from '@docusaurus/types';

function testLocaleConfigsFor(locales: string[]) {
  return Object.fromEntries(
    locales.map((locale) => [locale, getDefaultLocaleConfig(locale)]),
  );
}

function loadI18nTest(i18nConfig: I18nConfig, locale?: string) {
  return loadI18n(
    // @ts-expect-error: enough for this test
    {
      i18n: i18nConfig,
    },
    {locale},
  );
}

describe('defaultLocaleConfig', () => {
  it('returns correct labels', () => {
    expect(getDefaultLocaleConfig('fr')).toEqual({
      label: 'Français',
      direction: 'ltr',
      htmlLang: 'fr',
    });
    expect(getDefaultLocaleConfig('fr-FR')).toEqual({
      label: 'Français (France)',
      direction: 'ltr',
      htmlLang: 'fr-FR',
    });
    expect(getDefaultLocaleConfig('en')).toEqual({
      label: 'English',
      direction: 'ltr',
      htmlLang: 'en',
    });
    expect(getDefaultLocaleConfig('en-US')).toEqual({
      label: 'American English',
      direction: 'ltr',
      htmlLang: 'en-US',
    });
    expect(getDefaultLocaleConfig('zh')).toEqual({
      label: '中文',
      direction: 'ltr',
      htmlLang: 'zh',
    });
    expect(getDefaultLocaleConfig('zh-CN')).toEqual({
      label: '中文（中国）',
      direction: 'ltr',
      htmlLang: 'zh-CN',
    });
    expect(getDefaultLocaleConfig('en-US')).toEqual({
      label: 'American English',
      direction: 'ltr',
      htmlLang: 'en-US',
    });
    expect(getDefaultLocaleConfig('fa')).toEqual({
      // cSpell:ignore فارسی
      label: 'فارسی',
      direction: 'rtl',
      htmlLang: 'fa',
    });
    expect(getDefaultLocaleConfig('fa-IR')).toEqual({
      // cSpell:ignore ایران فارسیا
      label: 'فارسی (ایران)',
      direction: 'rtl',
      htmlLang: 'fa-IR',
    });
  });
});

describe('loadI18n', () => {
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  it('loads I18n for default config', async () => {
    await expect(loadI18nTest(DEFAULT_I18N_CONFIG)).resolves.toEqual({
      defaultLocale: 'en',
      locales: ['en'],
      currentLocale: 'en',
      localeConfigs: testLocaleConfigsFor(['en']),
    });
  });

  it('loads I18n for multi-lang config', async () => {
    await expect(
      loadI18nTest({
        defaultLocale: 'fr',
        locales: ['en', 'fr', 'de'],
        localeConfigs: {},
      }),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'fr',
      localeConfigs: testLocaleConfigsFor(['en', 'fr', 'de']),
    });
  });

  it('loads I18n for multi-locale config with specified locale', async () => {
    await expect(
      loadI18nTest(
        {
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de'],
          localeConfigs: {},
        },
        'de',
      ),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'de',
      localeConfigs: testLocaleConfigsFor(['en', 'fr', 'de']),
    });
  });

  it('loads I18n for multi-locale config with some custom locale configs', async () => {
    await expect(
      loadI18nTest(
        {
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de'],
          localeConfigs: {
            fr: {label: 'Français'},
            en: {},
          },
        },
        'de',
      ),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'de',
      localeConfigs: {
        fr: {label: 'Français', direction: 'ltr', htmlLang: 'fr'},
        en: getDefaultLocaleConfig('en'),
        de: getDefaultLocaleConfig('de'),
      },
    });
  });

  it('warns when trying to load undeclared locale', async () => {
    await loadI18nTest(
      {
        defaultLocale: 'fr',
        locales: ['en', 'fr', 'de'],
        localeConfigs: {},
      },
      'it',
    );
    expect(consoleSpy.mock.calls[0][0]).toMatch(
      /The locale .*it.* was not found in your site configuration/,
    );
  });
});
