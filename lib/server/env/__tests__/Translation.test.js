/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const Translation = require('../Translation');

let translation;

beforeEach(() => {
  translation = new Translation();
  translation.enabled = true;
  translation.languages = [
    {
      enabled: true,
      name: 'English',
      tag: 'en',
    },
    {
      enabled: true,
      name: '日本語',
      tag: 'ja',
    },
  ];
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('#getFileLanguage()', () => {
  const testDocEnglish = path.join('translated_docs', 'en', 'test.md');
  const testDocJapanese = path.join('translated_docs', 'ja', 'test.md');
  const testDocJapaneseInSubfolder = path.join(
    'translated_docs',
    'ja',
    'en',
    'test.md'
  );
  const testDocInSubfolder = path.join('docs', 'ro', 'test.md');
  const testDocNoLanguage = path.join('docs', 'test.md');

  expect(translation.getFileLanguage(testDocEnglish, 'translated_docs')).toBe(
    'en'
  );
  expect(translation.getFileLanguage(testDocJapanese, 'translated_docs')).toBe(
    'ja'
  );
  expect(
    translation.getFileLanguage(testDocJapaneseInSubfolder, 'translated_docs')
  ).toBe('ja');
  expect(translation.getFileLanguage(testDocInSubfolder, 'docs')).toBeNull();
  expect(translation.getFileLanguage(testDocNoLanguage, 'docs')).toBeNull();
});

describe('#t()', () => {
  beforeEach(() => {
    translation.translations = {};
  });

  test('translate default category', () => {
    translation.translations = {
      en: {
        'localized-strings': {
          foo: 'foo-en',
        },
      },
    };

    expect(translation.t('foo')).toBe('foo-en');
  });

  test('key specified by an array', () => {
    translation.translations = {
      en: {
        'localized-strings': {
          foo: {
            bar: {
              baz: 'baz-en',
            },
          },
        },
      },
    };

    expect(translation.t(['foo', 'bar', 'baz'])).toBe('baz-en');
  });

  test('translate default category in other lang', () => {
    translation.translations = {
      fr: {
        'localized-strings': {
          foo: 'foo-fr',
        },
      },
    };

    translation.setLanguage('fr');

    expect(translation.t('foo')).toBe('foo-fr');
  });

  test('fallback to en lang', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    translation.translations = {
      en: {
        'localized-strings': {
          foo: 'foo-en',
        },
      },
    };

    translation.setLanguage('fr');

    expect(translation.t('foo')).toBe('foo-en');
    expect(console.error).not.toHaveBeenCalled();
  });

  test('returns null when no translation', () => {
    expect(translation.t('foo')).toBe(null);
  });

  test('throws error when no translation for pages category', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    translation.setLanguage('fr');

    expect(() =>
      translation.t('foo', 'pages')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Text that you've identified for translation ('foo') hasn't been added to the global list in 'en.json'. To solve this problem run 'yarn write-translations'."`
    );
    expect(console.error).not.toHaveBeenCalled();
  });

  test('warns when fallbacks to default lang for pages category', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    translation.translations = {
      en: {
        'pages-strings': {
          foo: 'foo-en',
        },
      },
    };

    translation.setLanguage('fr');

    expect(translation.t('foo', 'pages')).toBe('foo-en');
    expect(console.error).toHaveBeenCalledWith(
      "Could not find a string translation in 'fr' for string 'foo'. Using English version instead."
    );
  });
});
