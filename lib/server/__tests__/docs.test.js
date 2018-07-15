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
const fs = require('fs');
const docs = require('../docs');
const metadataUtils = require('../metadataUtils');

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
        name: '日本語',
        tag: 'ja',
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

afterAll(() => {
  process.chdir(originalCwd);
});
