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
    latestVersion: '1.0.0',
  },
}));

const Metadata = require(path.join(__dirname, '__fixtures__', 'metadata.js'));

const doc1 = fs.readFileSync(
  path.join(__dirname, '__fixtures__', 'doc1.md'),
  'utf8',
);

const doc2 = fs.readFileSync(
  path.join(__dirname, '__fixtures__', 'doc2.md'),
  'utf8',
);

const rawContent1 = metadataUtils.extractMetadata(doc1).rawContent;
const rawContent2 = metadataUtils.extractMetadata(doc2).rawContent;

describe('mdToHtmlify', () => {
  const mdToHtml = metadataUtils.mdToHtml(Metadata, '/');

  test('transform nothing', () => {
    const content1 = docs.mdToHtmlify(
      rawContent1,
      mdToHtml,
      Metadata['en-doc1'],
    );
    expect(content1).not.toContain('/docs/en/next/');
    expect(content1).toMatchSnapshot();
    expect(content1).toEqual(rawContent1);
  });

  test('transform to correct link', () => {
    const content2 = docs.mdToHtmlify(
      rawContent2,
      mdToHtml,
      Metadata['en-doc2'],
    );
    expect(content2).toContain('/docs/en/next/');
    expect(content2).toMatchSnapshot();
    expect(content2).not.toEqual(rawContent2);
  });
});

describe('getFile', () => {
  const fakeContent = {
    'website/translated_docs/ko/doc1.md': '이건 가짜 야',
    'website/versioned_docs/version-1.0.0/doc2.md': 'Document 2 is not good',
    'website/translated_docs/ko/version-1.0.0/doc1.md':
      '이것은 오래된 가짜입니다.',
    'docs/doc1.md': 'Just another document',
  };
  fs.existsSync = jest.fn().mockReturnValue(true);
  fs.readFileSync = jest.fn().mockImplementation(file => {
    const fakePath = file.replace(process.cwd().replace(/website$/, ''), '');
    const normalizedPath = fakePath.replace(/\\/g, '/');
    return fakeContent[normalizedPath];
  });

  test('docs does not exist', () => {
    const metadata = Metadata['en-doc1'];
    fs.existsSync.mockReturnValueOnce(null);
    expect(docs.getFile(metadata)).toBeNull();
  });

  test('null/undefined metadata', () => {
    expect(docs.getFile(null)).toBeNull();
    expect(docs.getFile(undefined)).toBeNull();
  });

  test('translated docs', () => {
    const metadata = Metadata['ko-doc1'];
    expect(docs.getFile(metadata)).toEqual(
      fakeContent['website/translated_docs/ko/doc1.md'],
    );
  });

  test('versioned docs', () => {
    const metadata = Metadata['en-version-1.0.0-doc2'];
    expect(docs.getFile(metadata)).toEqual(
      fakeContent['website/versioned_docs/version-1.0.0/doc2.md'],
    );
  });

  test('translated & versioned docs', () => {
    const metadata = Metadata['ko-version-1.0.0-doc1'];
    expect(docs.getFile(metadata)).toEqual(
      fakeContent['website/translated_docs/ko/version-1.0.0/doc1.md'],
    );
  });

  test('normal docs', () => {
    const metadata = Metadata['en-doc1'];
    expect(docs.getFile(metadata)).toEqual(fakeContent['docs/doc1.md']);
  });
});

describe('replaceAssetsLink', () => {
  test('transform document with valid assets link', () => {
    const content1 = docs.replaceAssetsLink(rawContent1);
    expect(content1).toMatchSnapshot();
    expect(content1).toContain('![image1](/docs/assets/image1.png)');
    expect(content1).toContain('![image2](/docs/assets/image2.jpg)');
    expect(content1).toContain('![image3](/docs/assets/image3.gif)');
    expect(content1).toContain('![image4](assets/image4.bmp)');
    expect(content1).not.toContain('![image1](assets/image1.png)');
    expect(content1).not.toContain('![image2](assets/image2.jpg)');
    expect(content1).not.toContain('![image3](assets/image3.gif)');
    expect(content1).not.toContain('![image4](/docs/assets/image4.bmp)');
    expect(content1).not.toEqual(rawContent1);
  });

  test('does not transform document without valid assets link', () => {
    const content2 = docs.replaceAssetsLink(rawContent2);
    expect(content2).toMatchSnapshot();
    expect(content2).not.toContain('![image1](/docs/assets/image1.png)');
    expect(content2).not.toContain('![image2](/docs/assets/image2.jpg)');
    expect(content2).not.toContain('![image3](/docs/assets/image3.gif)');
    expect(content2).toEqual(rawContent2);
  });
});

afterAll(() => {
  process.chdir(originalCwd);
});
