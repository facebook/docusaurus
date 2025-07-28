/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import {loadI18n, getDefaultLocaleConfig} from '../i18n';
import {DEFAULT_I18N_CONFIG} from '../configValidation';
import type {DocusaurusConfig, I18nConfig} from '@docusaurus/types';

const loadI18nSiteDir = path.resolve(
  __dirname,
  '__fixtures__',
  'load-i18n-site',
);

const siteUrl = 'https://example.com';

function loadI18nTest({
  siteDir = loadI18nSiteDir,
  baseUrl = '/',
  i18nConfig,
  currentLocale,
  automaticBaseUrlLocalizationDisabled,
}: {
  siteDir?: string;
  baseUrl?: string;
  i18nConfig: I18nConfig;
  currentLocale: string;
  automaticBaseUrlLocalizationDisabled?: boolean;
}) {
  return loadI18n({
    siteDir,
    config: {
      i18n: i18nConfig,
      url: siteUrl,
      baseUrl,
    } as DocusaurusConfig,
    currentLocale,
    automaticBaseUrlLocalizationDisabled:
      automaticBaseUrlLocalizationDisabled ?? false,
  });
}

describe('defaultLocaleConfig', () => {
  it('returns correct labels', () => {
    expect(getDefaultLocaleConfig('fr')).toEqual({
      label: 'Français',
      direction: 'ltr',
      htmlLang: 'fr',
      calendar: 'gregory',
      path: 'fr',
    });
    expect(getDefaultLocaleConfig('fr-FR')).toEqual({
      label: 'Français (France)',
      direction: 'ltr',
      htmlLang: 'fr-FR',
      calendar: 'gregory',
      path: 'fr-FR',
    });
    expect(getDefaultLocaleConfig('en')).toEqual({
      label: 'English',
      direction: 'ltr',
      htmlLang: 'en',
      calendar: 'gregory',
      path: 'en',
    });
    expect(getDefaultLocaleConfig('en-US')).toEqual({
      label: 'American English',
      direction: 'ltr',
      htmlLang: 'en-US',
      calendar: 'gregory',
      path: 'en-US',
    });
    expect(getDefaultLocaleConfig('zh')).toEqual({
      label: '中文',
      direction: 'ltr',
      htmlLang: 'zh',
      calendar: 'gregory',
      path: 'zh',
    });
    expect(getDefaultLocaleConfig('zh-CN')).toEqual({
      label: '中文（中国）',
      direction: 'ltr',
      htmlLang: 'zh-CN',
      calendar: 'gregory',
      path: 'zh-CN',
    });
    expect(getDefaultLocaleConfig('en-US')).toEqual({
      label: 'American English',
      direction: 'ltr',
      htmlLang: 'en-US',
      calendar: 'gregory',
      path: 'en-US',
    });
    expect(getDefaultLocaleConfig('fa')).toEqual({
      // cSpell:ignore فارسی
      label: 'فارسی',
      direction: 'rtl',
      htmlLang: 'fa',
      calendar: 'persian',
      path: 'fa',
    });
    expect(getDefaultLocaleConfig('fa-IR')).toEqual({
      // cSpell:ignore ایران فارسیا
      label: 'فارسی (ایران)',
      direction: 'rtl',
      htmlLang: 'fa-IR',
      calendar: 'persian',
      path: 'fa-IR',
    });
    expect(getDefaultLocaleConfig('en-US-u-ca-buddhist')).toEqual({
      label: 'American English',
      direction: 'ltr',
      htmlLang: 'en-US-u-ca-buddhist',
      calendar: 'buddhist',
      path: 'en-US-u-ca-buddhist',
    });
  });
});

describe('loadI18n', () => {
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  it('loads I18n for default config', async () => {
    await expect(
      loadI18nTest({
        i18nConfig: DEFAULT_I18N_CONFIG,
        currentLocale: 'en',
      }),
    ).resolves.toEqual({
      path: 'i18n',
      defaultLocale: 'en',
      locales: ['en'],
      currentLocale: 'en',
      localeConfigs: {
        en: {
          ...getDefaultLocaleConfig('en'),
          translate: false,
          url: siteUrl,
          baseUrl: '/',
        },
      },
    });
  });

  it('loads I18n for multi-lang config', async () => {
    await expect(
      loadI18nTest({
        i18nConfig: {
          path: 'i18n',
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de'],
          localeConfigs: {},
        },
        currentLocale: 'fr',
      }),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      path: 'i18n',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'fr',
      localeConfigs: {
        en: {
          ...getDefaultLocaleConfig('en'),
          translate: false,
          url: siteUrl,
          baseUrl: '/en/',
        },
        fr: {
          ...getDefaultLocaleConfig('fr'),
          translate: true,
          url: siteUrl,
          baseUrl: '/',
        },
        de: {
          ...getDefaultLocaleConfig('de'),
          translate: true,
          url: siteUrl,
          baseUrl: '/de/',
        },
      },
    });
  });

  it('loads I18n for multi-lang config - with automaticBaseUrlLocalizationDisabled=true', async () => {
    await expect(
      loadI18nTest({
        i18nConfig: {
          path: 'i18n',
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de'],
          localeConfigs: {},
        },
        currentLocale: 'fr',
        automaticBaseUrlLocalizationDisabled: true,
      }),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      path: 'i18n',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'fr',
      localeConfigs: {
        en: {
          ...getDefaultLocaleConfig('en'),
          translate: false,
          url: siteUrl,
          baseUrl: '/',
        },
        fr: {
          ...getDefaultLocaleConfig('fr'),
          translate: true,
          url: siteUrl,
          baseUrl: '/',
        },
        de: {
          ...getDefaultLocaleConfig('de'),
          translate: true,
          url: siteUrl,
          baseUrl: '/',
        },
      },
    });
  });

  it('loads I18n for multi-locale config with specified locale', async () => {
    await expect(
      loadI18nTest({
        i18nConfig: {
          path: 'i18n',
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de'],
          localeConfigs: {},
        },
        currentLocale: 'de',
      }),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      path: 'i18n',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'de',
      localeConfigs: {
        en: {
          ...getDefaultLocaleConfig('en'),
          translate: false,
          url: siteUrl,
          baseUrl: '/en/',
        },
        fr: {
          ...getDefaultLocaleConfig('fr'),
          translate: true,
          url: siteUrl,
          baseUrl: '/',
        },
        de: {
          ...getDefaultLocaleConfig('de'),
          translate: true,
          url: siteUrl,
          baseUrl: '/de/',
        },
      },
    });
  });

  it('loads I18n for multi-locale config with some custom locale configs', async () => {
    await expect(
      loadI18nTest({
        i18nConfig: {
          path: 'i18n',
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de'],
          localeConfigs: {
            fr: {label: 'Français', translate: false},
            en: {translate: true, baseUrl: 'en-EN/whatever/else'},
            de: {translate: false, baseUrl: '/de-DE/'},
          },
        },

        currentLocale: 'de',
      }),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      path: 'i18n',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'de',
      localeConfigs: {
        fr: {
          label: 'Français',
          direction: 'ltr',
          htmlLang: 'fr',
          calendar: 'gregory',
          path: 'fr',
          translate: false,
          url: siteUrl,
          baseUrl: '/',
        },
        en: {
          ...getDefaultLocaleConfig('en'),
          translate: true,
          url: siteUrl,
          baseUrl: '/en-EN/whatever/else/',
        },
        de: {
          ...getDefaultLocaleConfig('de'),
          translate: false,
          url: siteUrl,
          baseUrl: '/de-DE/',
        },
      },
    });
  });

  it('loads I18n for multi-locale config with baseUrl edge cases', async () => {
    await expect(
      loadI18nTest({
        baseUrl: 'siteBaseUrl',
        i18nConfig: {
          path: 'i18n',
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de', 'pt'],
          localeConfigs: {
            fr: {},
            en: {baseUrl: ''},
            de: {baseUrl: '/de-DE/'},
          },
        },
        currentLocale: 'de',
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        localeConfigs: {
          fr: expect.objectContaining({
            baseUrl: '/siteBaseUrl/',
          }),
          en: expect.objectContaining({
            baseUrl: '/',
          }),
          de: expect.objectContaining({
            baseUrl: '/de-DE/',
          }),
          pt: expect.objectContaining({
            baseUrl: '/siteBaseUrl/pt/',
          }),
        },
      }),
    );
  });

  it('loads I18n for multi-locale config with custom urls', async () => {
    await expect(
      loadI18nTest({
        baseUrl: 'siteBaseUrl',
        i18nConfig: {
          path: 'i18n',
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de', 'pt'],
          localeConfigs: {
            fr: {url: 'https://fr.example.com'},
            en: {url: 'https://en.example.com'},
          },
        },
        currentLocale: 'de',
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        localeConfigs: {
          fr: expect.objectContaining({
            url: 'https://fr.example.com',
          }),
          en: expect.objectContaining({
            url: 'https://en.example.com',
          }),
          de: expect.objectContaining({
            url: siteUrl,
          }),
          pt: expect.objectContaining({
            url: siteUrl,
          }),
        },
      }),
    );
  });

  it('warns when trying to load undeclared locale', async () => {
    await loadI18nTest({
      i18nConfig: {
        path: 'i18n',
        defaultLocale: 'fr',
        locales: ['en', 'fr', 'de'],
        localeConfigs: {},
      },
      currentLocale: 'it',
    });
    expect(consoleSpy.mock.calls[0]![0]).toMatch(
      /The locale .*it.* was not found in your site configuration/,
    );
  });
});
