/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {LoadedContent, DocMetadata, LoadedVersion} from '../types';
import {CURRENT_VERSION_NAME} from '../constants';
import {
  getLoadedContentTranslationFiles,
  translateLoadedContent,
} from '../translations';
import {updateTranslationFileMessages} from '@docusaurus/utils';

function createSampleDoc(doc: Pick<DocMetadata, 'id'>): DocMetadata {
  return {
    editUrl: 'any',
    isDocsHomePage: false,
    lastUpdatedAt: 0,
    lastUpdatedBy: 'any',
    next: undefined,
    previous: undefined,
    permalink: 'any',
    slug: 'any',
    source: 'any',
    unversionedId: 'any',
    version: 'any',
    title: `${doc.id} title`,
    sidebar_label: `${doc.id} title`,
    description: `${doc.id} description`,
    ...doc,
  };
}

function createSampleVersion(
  version: Pick<LoadedVersion, 'versionName'>,
): LoadedVersion {
  return {
    versionLabel: `${version.versionName} label`,
    versionPath: '/docs/',
    mainDocId: '',
    routePriority: undefined,
    sidebarFilePath: 'any',
    isLast: true,
    contentPath: 'any',
    contentPathLocalized: 'any',
    docs: [
      createSampleDoc({
        id: 'doc1',
      }),
      createSampleDoc({
        id: 'doc2',
      }),
      createSampleDoc({
        id: 'doc3',
      }),
      createSampleDoc({
        id: 'doc4',
      }),
      createSampleDoc({
        id: 'doc5',
      }),
    ],
    sidebars: {
      docs: [
        {
          type: 'category',
          label: 'Getting started',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'doc1',
            },
            {
              type: 'doc',
              id: 'doc2',
            },
            {
              type: 'link',
              label: 'Link label',
              href: 'https://facebook.com',
            },
            {
              type: 'ref',
              id: 'doc1',
            },
          ],
        },
        {
          type: 'doc',
          id: 'doc3',
        },
      ],
      otherSidebar: [
        {
          type: 'doc',
          id: 'doc4',
        },
        {
          type: 'doc',
          id: 'doc5',
        },
      ],
    },
    ...version,
  };
}

const SampleLoadedContent: LoadedContent = {
  loadedVersions: [
    createSampleVersion({
      versionName: CURRENT_VERSION_NAME,
    }),
    createSampleVersion({
      versionName: '2.0.0',
    }),
    createSampleVersion({
      versionName: '1.0.0',
    }),
  ],
};

function getSampleTranslationFiles() {
  return getLoadedContentTranslationFiles(SampleLoadedContent);
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

describe('getLoadedContentTranslationFiles', () => {
  test('should return translation files matching snapshot', async () => {
    expect(getSampleTranslationFiles()).toMatchSnapshot();
  });
});

describe('translateLoadedContent', () => {
  test('should not translate anything if translation files are untranslated', () => {
    const translationFiles = getSampleTranslationFiles();
    expect(
      translateLoadedContent(SampleLoadedContent, translationFiles),
    ).toEqual(SampleLoadedContent);
  });

  test('should return translated loaded content matching snapshot', () => {
    const translationFiles = getSampleTranslationFilesTranslated();
    expect(
      translateLoadedContent(SampleLoadedContent, translationFiles),
    ).toMatchSnapshot();
  });
});
