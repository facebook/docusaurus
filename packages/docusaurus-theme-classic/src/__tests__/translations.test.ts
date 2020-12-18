/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getTranslationFiles, translateThemeConfig} from '../translations';
import {ThemeConfig} from '@docusaurus/theme-common';
import {updateTranslationFileMessages} from '@docusaurus/utils';

const ThemeConfigSample: ThemeConfig = {
  colorMode: {},
  announcementBar: {},
  prism: {},
  docs: {
    versionPersistence: 'none',
  },
  hideableSidebar: true,
  navbar: {
    title: 'navbar title',
    style: 'dark',
    hideOnScroll: false,
    items: [
      {label: 'Dropdown', items: [{label: 'Dropdown item 1', items: []}]},
    ],
  },
  footer: {
    copyright: 'Copyright FB',
    style: 'light',
    links: [
      {
        title: 'Footer link column 1',
        items: [
          {label: 'Link 1', to: 'https://facebook.com'},
          {label: 'Link 2', to: 'https://facebook.com'},
        ],
      },
      {
        title: 'Footer link column 2',
        items: [{label: 'Link 3', to: 'https://facebook.com'}],
      },
    ],
  },
};

function getSampleTranslationFiles() {
  return getTranslationFiles({
    themeConfig: ThemeConfigSample,
  });
}

function getSampleTranslationFilesTranslated() {
  const translationFiles = getSampleTranslationFiles();
  return translationFiles.map((translationFile) =>
    updateTranslationFileMessages(
      translationFile,
      (message) => `${message} (translated)`,
    ),
  );
}

describe('getTranslationFiles', () => {
  test('should return translation files matching snapshot', () => {
    expect(getSampleTranslationFiles()).toMatchSnapshot();
  });
});

describe('translateThemeConfig', () => {
  test('should not translate anything if translation files are untranslated', () => {
    const translationFiles = getSampleTranslationFiles();
    expect(
      translateThemeConfig({
        themeConfig: ThemeConfigSample,
        translationFiles,
      }),
    ).toEqual(ThemeConfigSample);
  });

  test('should return translated themeConfig matching snapshot', () => {
    const translationFiles = getSampleTranslationFilesTranslated();
    expect(
      translateThemeConfig({
        themeConfig: ThemeConfigSample,
        translationFiles,
      }),
    ).toMatchSnapshot();
  });
});

describe('getTranslationFiles and translateThemeConfig isomorphism', () => {
  function verifyIsomorphism(themeConfig: ThemeConfig) {
    const translationFiles = getTranslationFiles({themeConfig});
    const translatedThemeConfig = translateThemeConfig({
      themeConfig,
      translationFiles,
    });
    expect(translatedThemeConfig).toEqual(themeConfig);
  }

  test('should be verified for main sample', () => {
    verifyIsomorphism(ThemeConfigSample);
  });

  // undefined footer should not make the translation code crash
  // See https://github.com/facebook/docusaurus/issues/3936
  test('should be verified for sample without footer', () => {
    verifyIsomorphism({...ThemeConfigSample, footer: undefined});
  });
});
