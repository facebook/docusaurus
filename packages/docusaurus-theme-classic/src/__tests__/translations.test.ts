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
      {
        label: 'Dropdown',
        items: [
          {label: 'Dropdown item 1', items: []},
          {label: 'Dropdown item 2', items: []},
        ],
      },
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

const ThemeConfigSampleSimpleFooter: ThemeConfig = {
  ...ThemeConfigSample,
  footer: {
    copyright: 'Copyright FB',
    style: 'light',
    links: [
      {label: 'Link 1', to: 'https://facebook.com'},
      {label: 'Link 2', to: 'https://facebook.com'},
    ],
  },
};

function getSampleTranslationFiles(themeConfig: ThemeConfig) {
  return getTranslationFiles({
    themeConfig,
  });
}

function getSampleTranslationFilesTranslated(themeConfig: ThemeConfig) {
  const translationFiles = getSampleTranslationFiles(themeConfig);
  return translationFiles.map((translationFile) =>
    updateTranslationFileMessages(
      translationFile,
      (message) => `${message} (translated)`,
    ),
  );
}

describe('getTranslationFiles', () => {
  test('should return translation files matching snapshot', () => {
    expect(getSampleTranslationFiles(ThemeConfigSample)).toMatchSnapshot();
    expect(
      getSampleTranslationFiles(ThemeConfigSampleSimpleFooter),
    ).toMatchSnapshot();
  });
});

describe('translateThemeConfig', () => {
  test('should not translate anything if translation files are untranslated', () => {
    expect(
      translateThemeConfig({
        themeConfig: ThemeConfigSample,
        translationFiles: getSampleTranslationFiles(ThemeConfigSample),
      }),
    ).toEqual(ThemeConfigSample);
  });

  test('should return translated themeConfig matching snapshot', () => {
    expect(
      translateThemeConfig({
        themeConfig: ThemeConfigSample,
        translationFiles:
          getSampleTranslationFilesTranslated(ThemeConfigSample),
      }),
    ).toMatchSnapshot();
  });
});

describe('getTranslationFiles and translateThemeConfig isomorphism', () => {
  function verifyIsomorphism(themeConfig: ThemeConfig) {
    const translatedThemeConfig = translateThemeConfig({
      themeConfig,
      translationFiles: getTranslationFiles({themeConfig}),
    });
    expect(translatedThemeConfig).toEqual(themeConfig);
  }

  test('should be verified for sample', () => {
    verifyIsomorphism(ThemeConfigSample);
  });

  test('should be verified for sample with simple footer', () => {
    verifyIsomorphism(ThemeConfigSampleSimpleFooter);
  });

  // undefined footer should not make the translation code crash
  // See https://github.com/facebook/docusaurus/issues/3936
  test('should be verified for sample without footer', () => {
    verifyIsomorphism({...ThemeConfigSample, footer: undefined});
  });
});
