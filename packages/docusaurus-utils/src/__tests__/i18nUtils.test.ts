/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  mergeTranslations,
  updateTranslationFileMessages,
  getPluginI18nPath,
  localizePath,
} from '../i18nUtils';

describe('mergeTranslations', () => {
  it('works', () => {
    expect(
      mergeTranslations([
        {
          T1: {message: 'T1 message', description: 'T1 desc'},
          T2: {message: 'T2 message', description: 'T2 desc'},
          T3: {message: 'T3 message', description: 'T3 desc'},
        },
        {
          T4: {message: 'T4 message', description: 'T4 desc'},
        },
        {T2: {message: 'T2 message 2', description: 'T2 desc 2'}},
      ]),
    ).toEqual({
      T1: {message: 'T1 message', description: 'T1 desc'},
      T2: {message: 'T2 message 2', description: 'T2 desc 2'},
      T3: {message: 'T3 message', description: 'T3 desc'},
      T4: {message: 'T4 message', description: 'T4 desc'},
    });
  });
});

describe('updateTranslationFileMessages', () => {
  it('works', () => {
    expect(
      updateTranslationFileMessages(
        {
          path: 'abc',
          content: {
            t1: {message: 't1 message', description: 't1 desc'},
            t2: {message: 't2 message', description: 't2 desc'},
            t3: {message: 't3 message', description: 't3 desc'},
          },
        },
        (message) => `prefix ${message} suffix`,
      ),
    ).toEqual({
      path: 'abc',
      content: {
        t1: {message: 'prefix t1 message suffix', description: 't1 desc'},
        t2: {message: 'prefix t2 message suffix', description: 't2 desc'},
        t3: {message: 'prefix t3 message suffix', description: 't3 desc'},
      },
    });
  });
});

describe('getPluginI18nPath', () => {
  it('gets correct path', () => {
    expect(
      getPluginI18nPath({
        localizationDir: '<SITE_DIR>/i18n/zh-Hans',
        pluginName: 'plugin-content-docs',
        pluginId: 'community',
        subPaths: ['foo'],
      }),
    ).toMatchInlineSnapshot(
      `"<SITE_DIR>/i18n/zh-Hans/plugin-content-docs-community/foo"`,
    );
  });
  it('gets correct path for default plugin', () => {
    expect(
      getPluginI18nPath({
        localizationDir: '<SITE_DIR>/i18n/zh-Hans',
        pluginName: 'plugin-content-docs',
        subPaths: ['foo'],
      }),
    ).toMatchInlineSnapshot(
      `"<SITE_DIR>/i18n/zh-Hans/plugin-content-docs/foo"`,
    );
  });
  it('gets correct path when no sub-paths', () => {
    expect(
      getPluginI18nPath({
        localizationDir: '<SITE_DIR>/i18n/zh-Hans',
        pluginName: 'plugin-content-docs',
      }),
    ).toMatchInlineSnapshot(`"<SITE_DIR>/i18n/zh-Hans/plugin-content-docs"`);
  });
});

describe('localizePath', () => {
  it('localizes url path with current locale', () => {
    expect(
      localizePath({
        pathType: 'url',
        path: '/baseUrl',
        i18n: {
          defaultLocale: 'en',
          path: 'i18n',
          locales: ['en', 'fr'],
          currentLocale: 'fr',
          localeConfigs: {},
        },
        options: {localizePath: true},
      }),
    ).toBe('/baseUrl/fr/');
  });

  it('localizes fs path with current locale', () => {
    expect(
      localizePath({
        pathType: 'fs',
        path: '/baseFsPath',
        i18n: {
          defaultLocale: 'en',
          path: 'i18n',
          locales: ['en', 'fr'],
          currentLocale: 'fr',
          localeConfigs: {fr: {path: 'fr'}, en: {path: 'en'}},
        },
        options: {localizePath: true},
      }),
    ).toBe(`${path.sep}baseFsPath${path.sep}fr`);
  });

  it('localizes path for default locale, if requested', () => {
    expect(
      localizePath({
        pathType: 'url',
        path: '/baseUrl/',
        i18n: {
          defaultLocale: 'en',
          path: 'i18n',
          locales: ['en', 'fr'],
          currentLocale: 'en',
          localeConfigs: {fr: {path: 'fr'}, en: {path: 'en'}},
        },
        options: {localizePath: true},
      }),
    ).toBe('/baseUrl/en/');
  });

  it('does not localize path for default locale by default', () => {
    expect(
      localizePath({
        pathType: 'url',
        path: '/baseUrl/',
        i18n: {
          defaultLocale: 'en',
          path: 'i18n',
          locales: ['en', 'fr'],
          currentLocale: 'en',
          localeConfigs: {fr: {path: 'fr'}, en: {path: 'en'}},
        },
      }),
    ).toBe('/baseUrl/');
  });

  it('localizes path for non-default locale by default', () => {
    expect(
      localizePath({
        pathType: 'url',
        path: '/baseUrl/',
        i18n: {
          defaultLocale: 'en',
          path: 'i18n',
          locales: ['en', 'fr'],
          currentLocale: 'en',
          localeConfigs: {fr: {path: 'fr'}, en: {path: 'en'}},
        },
      }),
    ).toBe('/baseUrl/');
  });
});
