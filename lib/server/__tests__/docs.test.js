/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// simulate cwd to website so all require (CWD+'/siteConfig.js') will work
const originalCwd = process.cwd();
if (!/website$/.test(originalCwd)) {
  process.chdir(process.cwd() + '/website');
}
const path = require('path');
const fs = require('fs-extra');
const docs = require('../docs');
const metadataUtils = require('../metadataUtils');
const readMetadata = require('../readMetadata.js');

jest.mock('../env', () => ({
  translation: {
    enabled: true,
    enabledLanguages: () => [
      {
        enabled: true,
        name: 'English',
        tag: 'en',
      },
      {
        enabled: true,
        name: '한국어',
        tag: 'ko',
      },
    ],
  },
  versioning: {
    enabled: true,
    defaultVersion: '1.0.0',
  },
}));

const Metadata = {
  'en-doc1': {
    id: 'en-doc1',
    title: 'Document 1',
    source: 'doc1.md',
    version: 'next',
    permalink: 'docs/en/next/doc1.html',
    localized_id: 'doc1',
    language: 'en',
    sidebar: 'docs',
    category: 'Test',
    next_id: 'doc2',
    next: 'en-doc2',
    next_title: 'Document 2',
  },
  'en-doc2': {
    id: 'en-doc2',
    title: 'Document 2',
    source: 'doc2.md',
    version: 'next',
    permalink: 'docs/en/next/doc2.html',
    localized_id: 'doc2',
    language: 'en',
    sidebar: 'docs',
    category: 'Test',
    previous_id: 'doc1',
    previous: 'en-doc1',
    previous_title: 'Document 1',
  },
  'ko-doc1': {
    id: 'ko-doc1',
    title: '문서 1',
    source: 'doc1.md',
    version: 'next',
    permalink: 'docs/ko/next/doc1.html',
    localized_id: 'doc1',
    language: 'ko',
    sidebar: 'docs',
    category: 'Test',
    next_id: 'doc2',
    next: 'ko-doc2',
    next_title: '문서 2',
  },
  'ko-doc2': {
    id: 'ko-doc2',
    title: '문서 2',
    source: 'doc2.md',
    version: 'next',
    permalink: 'docs/ko/next/doc2.html',
    localized_id: 'doc2',
    language: 'ko',
    sidebar: 'docs',
    category: 'Test',
    previous_id: 'doc1',
    previous: 'ko-doc1',
    previous_title: '문서 1',
  },
  'en-version-1.0.0-doc1': {
    id: 'en-version-1.0.0-doc1',
    original_id: 'doc1',
    title: 'Document 1',
    source: 'version-1.0.0/doc1.md',
    version: '1.0.0',
    permalink: 'docs/en/doc1.html',
    localized_id: 'version-1.0.0-doc1',
    language: 'en',
    sidebar: 'version-1.0.0-docs',
    category: 'Test',
    next_id: 'doc2',
    next: 'en-version-1.0.0-doc2',
    next_title: 'Document 2',
  },
  'en-version-1.0.0-doc2': {
    id: 'en-version-1.0.0-doc2',
    original_id: 'doc2',
    title: 'Document 2',
    source: 'version-1.0.0/doc2.md',
    version: '1.0.0',
    permalink: 'docs/en/doc2.html',
    localized_id: 'version-1.0.0-doc2',
    language: 'en',
    sidebar: 'version-1.0.0-docs',
    category: 'Test',
    previous_id: 'doc1',
    previous: 'en-version-1.0.0-doc1',
    previous_title: 'Document 1',
  },
  'ko-version-1.0.0-doc1': {
    id: 'ko-version-1.0.0-doc1',
    title: '문서 1',
    source: 'version-1.0.0/doc1.md',
    version: '1.0.0',
    permalink: 'docs/ko/doc1.html',
    localized_id: 'version-1.0.0-doc1',
    language: 'ko',
    sidebar: 'version-1.0.0-docs',
    category: 'Test',
    next_id: 'doc2',
    next: 'ko-version-1.0.0-doc2',
    next_title: '문서 2',
  },
  'ko-version-1.0.0-doc2': {
    id: 'ko-version-1.0.0-doc2',
    title: '문서 2',
    source: 'version-1.0.0/doc2.md',
    version: '1.0.0',
    permalink: 'docs/ko/doc2.html',
    localized_id: 'version-1.0.0-doc2',
    language: 'ko',
    sidebar: 'version-1.0.0-docs',
    category: 'Test',
    previous_id: 'doc1',
    previous: 'ko-version-1.0.0-doc1',
    previous_title: '문서 1',
  },
};

const doc1 = fs.readFileSync(
  path.join(__dirname, '__fixtures__', 'doc1.md'),
  'utf8'
);

const doc2 = fs.readFileSync(
  path.join(__dirname, '__fixtures__', 'doc2.md'),
  'utf8'
);

describe('mdToHtmlify', () => {
  const rawContent1 = metadataUtils.extractMetadata(doc1).rawContent;
  const rawContent2 = metadataUtils.extractMetadata(doc2).rawContent;
  const mdToHtml = metadataUtils.mdToHtml(Metadata, '/');

  test('transform nothing', () => {
    const content1 = docs.mdToHtmlify(
      rawContent1,
      mdToHtml,
      Metadata['en-doc1']
    );
    expect(content1).toMatchSnapshot();
    expect(content1).toEqual(rawContent1);
  });

  test('transform to correct link', () => {
    const content2 = docs.mdToHtmlify(
      rawContent2,
      mdToHtml,
      Metadata['en-doc2']
    );
    expect(content2).toMatchSnapshot();
    expect(content2).not.toEqual(rawContent2);
  });
});

describe('getFile', () => {
  test('translated docs', () => {
    const metadata = Metadata['ko-doc1'];
    const spy = jest.spyOn(fs, 'existsSync');

    docs.getFile(metadata);
    expect(spy).toHaveBeenLastCalledWith(
      path.join(
        process.cwd(),
        'translated_docs',
        metadata.language,
        metadata.source
      )
    );
    spy.mockRestore();
  });

  test('versioned docs', () => {
    const metadata = Metadata['en-version-1.0.0-doc2'];
    const spy = jest.spyOn(fs, 'existsSync');

    docs.getFile(metadata);
    expect(spy).toHaveBeenLastCalledWith(
      path.join(process.cwd(), 'versioned_docs', metadata.source)
    );
    spy.mockRestore();
  });

  test('translated & versioned docs', () => {
    const metadata = Metadata['ko-version-1.0.0-doc1'];
    const spy = jest.spyOn(fs, 'existsSync');

    docs.getFile(metadata);
    expect(spy).toHaveBeenLastCalledWith(
      path.join(
        process.cwd(),
        'translated_docs',
        metadata.language,
        metadata.source
      )
    );
    spy.mockRestore();
  });

  test('normal docs', () => {
    const metadata = Metadata['en-doc1'];
    const spy = jest.spyOn(fs, 'existsSync');

    docs.getFile(metadata);
    expect(spy).toHaveBeenLastCalledWith(
      path.join(
        process.cwd(),
        '..',
        readMetadata.getDocsPath(),
        metadata.source
      )
    );
    spy.mockRestore();
  });
});

afterAll(() => {
  process.chdir(originalCwd);
});
