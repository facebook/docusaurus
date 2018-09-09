/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const DocsMetadata = require('../DocsMetadata');

afterEach(() => {
  jest.resetAllMocks();
});

test('metadata for simple docs', () => {
  const docsDir = `${__dirname}/__fixtures__/simple-docs`;
  const meta = new DocsMetadata({
    docsDir,
    translatedDir: '',
    versionFallback: {
      docData() {
        return [];
      },
      sidebarData() {
        return {};
      },
    },
    sidebars: {
      root: {
        Test: ['doc1', 'doc2'],
      },
    },
    translation: {
      enabled: false,
      getFileLanguage() {
        return null;
      },
      enabledLanguages() {
        return [
          {
            enabled: true,
            name: 'English',
            tag: 'en',
          },
        ];
      },
    },
    versioning: {
      enabled: false,
    },
    useEnglishUrl: false,
  });

  const result = meta.populate();

  expect(result).toMatchSnapshot();
});

test('wrong id format', () => {
  const docsDir = `${__dirname}/__fixtures__/invalid-docs`;
  const meta = new DocsMetadata({
    docsDir,
    translatedDir: '',
    versionFallback: {
      docData() {
        return [];
      },
      sidebarData() {
        return {};
      },
    },
    sidebars: {},
    translation: {
      enabled: false,
      getFileLanguage() {
        return null;
      },
      enabledLanguages() {
        return [
          {
            enabled: true,
            name: 'English',
            tag: 'en',
          },
        ];
      },
    },
    versioning: {
      enabled: false,
    },
    useEnglishUrl: false,
  });
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  expect(meta.populate.bind(meta)).toThrowErrorMatchingSnapshot();
  expect(console.warn).toHaveBeenCalledWith(
    expect.stringMatching(/Header field "bad" in .* is not supported/)
  );
});

it('metadata for siteConfig.useEnglishUrl', () => {
  const docsDir = `${__dirname}/__fixtures__/simple-docs`;
  const meta = new DocsMetadata({
    docsDir,
    translatedDir: '',
    versionFallback: {
      docData() {
        return [];
      },
      sidebarData() {
        return {};
      },
    },
    sidebars: {
      root: {
        Test: ['doc1', 'doc2'],
      },
    },
    translation: {
      enabled: false,
      getFileLanguage() {
        return null;
      },
      enabledLanguages() {
        return [
          {
            enabled: true,
            name: 'English',
            tag: 'en',
          },
        ];
      },
    },
    versioning: {
      enabled: false,
    },
    useEnglishUrl: true,
  });

  const result = meta.populate();

  expect(result).toMatchSnapshot();
});

test('metadata with versioning', () => {
  const docsDir = `${__dirname}/__fixtures__/simple-docs`;
  const meta = new DocsMetadata({
    docsDir,
    translatedDir: '',
    versionFallback: {
      docData() {
        return [
          {
            id: 'en-version-1.3.1-translation',
            title: 'Translations & Localization',
            original_id: 'translation',
            source: 'version-1.2.1/guides-translation.md',
            permalink: 'docs/en/1.3.1/translation.html',
            localized_id: 'version-1.3.1-translation',
            language: 'en',
            version: '1.3.1',
          },
          {
            id: 'en-version-1.3.1-versioning',
            title: 'Versioning',
            original_id: 'versioning',
            source: 'version-1.2.0/guides-versioning.md',
            permalink: 'docs/en/1.3.1/versioning.html',
            localized_id: 'version-1.3.1-versioning',
            language: 'en',
            version: '1.3.1',
          },
          {
            id: 'en-version-1.3.1-no-sidebar',
            title: 'No Sidebar',
            original_id: 'no-sidebar',
            source: 'version-1.2.0/guides-no-sidebar.md',
            permalink: 'docs/en/1.3.1/no-sidebar.html',
            localized_id: 'version-1.3.1-no-sidebar',
            language: 'en',
            version: '1.3.1',
          },
        ];
      },
      sidebarData() {
        return {
          'version-1.3.1-docs': {
            Guides: [
              'version-1.3.1-navigation',
              'version-1.3.1-translation',
              'version-1.3.1-versioning',
            ],
          },
        };
      },
    },
    sidebars: {
      root: {
        Test: ['doc1', 'doc2'],
      },
    },
    translation: {
      enabled: false,
      getFileLanguage() {
        return null;
      },
      enabledLanguages() {
        return [
          {
            enabled: true,
            name: 'English',
            tag: 'en',
          },
        ];
      },
    },
    versioning: {
      enabled: true,
    },
    useEnglishUrl: false,
  });

  const result = meta.populate();

  expect(result).toMatchSnapshot();
});

test('metadata with translations', () => {
  const docsDir = `${__dirname}/__fixtures__/simple-docs`;
  const translatedDir = `${__dirname}/__fixtures__/translated-docs`;
  const meta = new DocsMetadata({
    docsDir,
    translatedDir,
    versionFallback: {
      docData() {
        return [];
      },
      sidebarData() {
        return {};
      },
    },
    sidebars: {
      root: {
        Test: ['doc1', 'doc2'],
      },
    },
    translation: {
      enabled: true,
      getFileLanguage(file) {
        return file.includes('/de/') ? 'de' : 'en';
      },
      enabledLanguages() {
        return [
          {
            enabled: true,
            name: 'English',
            tag: 'en',
          },
          {
            enabled: true,
            name: 'Deutsch',
            tag: 'de',
          },
        ];
      },
    },
    versioning: {
      enabled: false,
    },
  });

  const result = meta.populate();

  expect(result).toMatchSnapshot();
});

test('metadata with translations and versioning', () => {
  const docsDir = `${__dirname}/__fixtures__/simple-docs`;
  const translatedDir = `${__dirname}/__fixtures__/translated-docs`;
  const meta = new DocsMetadata({
    docsDir,
    translatedDir,
    versionFallback: {
      docData() {
        return [];
      },
      sidebarData() {
        return {};
      },
    },
    sidebars: {
      root: {
        Test: ['doc1', 'doc2'],
      },
    },
    translation: {
      enabled: true,
      getFileLanguage(file) {
        return file.includes('/de/') ? 'de' : 'en';
      },
      enabledLanguages() {
        return [
          {
            enabled: true,
            name: 'English',
            tag: 'en',
          },
          {
            enabled: true,
            name: 'Deutsch',
            tag: 'de',
          },
        ];
      },
    },
    versioning: {
      enabled: true,
    },
    useEnglishUrl: false,
  });

  const result = meta.populate();

  expect(result).toMatchSnapshot();
});
