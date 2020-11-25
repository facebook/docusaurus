/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getTranslationFiles, translateThemeConfig} from '../translations';
import {ThemeConfig} from '@docusaurus/theme-common';
import {mapValues} from 'lodash';
import {TranslationFile} from '@docusaurus/types';

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

// Add a " (translated)" suffix to all messages of a translation file
// to simulate translated messages
function translateTranslationFile(
  translationFile: TranslationFile,
): TranslationFile {
  const translatedContent = mapValues(
    translationFile.content,
    (translation) => ({
      ...translation,
      message: `${translation.message} (translated)`,
    }),
  );
  return {
    path: translationFile.path,
    content: translatedContent,
  };
}

function getSampleTranslationFiles() {
  return getTranslationFiles({
    themeConfig: ThemeConfigSample,
  });
}

async function getSampleTranslationFilesTranslated() {
  const translationFiles = await getSampleTranslationFiles();
  return translationFiles.map(translateTranslationFile);
}

describe('getTranslationFiles', () => {
  test('should return translation files matching snapshot', async () => {
    await expect(getSampleTranslationFiles()).resolves.toMatchSnapshot();
  });
});

describe('translateThemeConfig', () => {
  test('should not translate anything if translation files are untranslated', async () => {
    const translationFiles = await getSampleTranslationFiles();
    expect(
      translateThemeConfig({
        themeConfig: ThemeConfigSample,
        translationFiles,
      }),
    ).toEqual(ThemeConfigSample);
  });

  test('should return translated themeConfig matching snapshot', async () => {
    const translationFiles = await getSampleTranslationFilesTranslated();
    expect(
      translateThemeConfig({
        themeConfig: ThemeConfigSample,
        translationFiles,
      }),
    ).toMatchSnapshot();
  });
});
