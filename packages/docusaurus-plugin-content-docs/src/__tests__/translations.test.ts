/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {updateTranslationFileMessages} from '@docusaurus/utils';
import {CURRENT_VERSION_NAME} from '../constants';
import {
  getLoadedContentTranslationFiles,
  translateLoadedContent,
} from '../translations';
import type {
  DocMetadata,
  LoadedContent,
  LoadedVersion,
} from '@docusaurus/plugin-content-docs';

function createSampleDoc(doc: Pick<DocMetadata, 'id'>): DocMetadata {
  return {
    sourceDirName: '',
    draft: false,
    tags: [],
    editUrl: 'any',
    lastUpdatedAt: 0,
    lastUpdatedBy: 'any',
    next: undefined,
    previous: undefined,
    permalink: 'any',
    slug: 'any',
    source: 'any',
    version: 'any',
    title: `${doc.id} title`,
    frontMatter: {
      sidebar_label: `${doc.id} title`,
    },
    description: `${doc.id} description`,
    ...doc,
  };
}

function createSampleVersion(
  version: Pick<LoadedVersion, 'versionName'>,
): LoadedVersion {
  return {
    label: `${version.versionName} label`,
    path: '/docs/',
    routePriority: undefined,
    sidebarFilePath: 'any',
    isLast: true,
    contentPath: 'any',
    contentPathLocalized: 'any',
    tagsPath: '/tags/',
    banner: null,
    badge: true,
    className: '',
    drafts: [],
    docs: [
      createSampleDoc({id: 'doc1'}),
      createSampleDoc({id: 'doc2'}),
      createSampleDoc({id: 'doc3'}),
      createSampleDoc({id: 'doc4'}),
      createSampleDoc({id: 'doc5'}),
    ],
    sidebars: {
      docs: [
        {
          type: 'category',
          label: 'Getting started',
          collapsed: false,
          collapsible: true,
          link: {
            type: 'generated-index',
            slug: '/category/getting-started-index-slug',
            permalink: '/docs/category/getting-started-index-slug',
            title: 'Getting started index title',
            description: 'Getting started index description',
          },
          items: [
            {
              type: 'doc',
              id: 'doc1',
            },
            {
              type: 'doc',
              id: 'doc2',
              label: 'Second doc translatable',
              translatable: true,
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
          type: 'ref',
          id: 'doc5',
          label: 'Fifth doc translatable',
          translatable: true,
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
  it('returns translation files', () => {
    expect(getSampleTranslationFiles()).toMatchSnapshot();
  });
});

describe('translateLoadedContent', () => {
  it('does not translate anything if translation files are untranslated', () => {
    const translationFiles = getSampleTranslationFiles();
    expect(
      translateLoadedContent(SampleLoadedContent, translationFiles),
    ).toEqual(SampleLoadedContent);
  });

  it('returns translated loaded content', () => {
    const translationFiles = getSampleTranslationFilesTranslated();
    expect(
      translateLoadedContent(SampleLoadedContent, translationFiles),
    ).toMatchSnapshot();
  });
});
