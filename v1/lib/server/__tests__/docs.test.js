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
const {replaceAssetsLink} = require('../utils.js');

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

const doc3 = fs.readFileSync(
  path.join(__dirname, '__fixtures__', 'subdir', 'doc3.md'),
  'utf8',
);

const refLinks = fs.readFileSync(
  path.join(__dirname, '__fixtures__', 'reflinks.md'),
  'utf8',
);

const rawContent1 = metadataUtils.extractMetadata(doc1).rawContent;
const rawContent2 = metadataUtils.extractMetadata(doc2).rawContent;
const rawContent3 = metadataUtils.extractMetadata(doc3).rawContent;
const rawContentRefLinks = metadataUtils.extractMetadata(refLinks).rawContent;

describe('mdToHtmlify', () => {
  const siteConfig = {
    baseUrl: '/',
    docsUrl: 'docs',
  };
  const mdToHtml = metadataUtils.mdToHtml(Metadata, siteConfig);

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

  test('transform link even in subdirectory', () => {
    const customMetadata = {
      'subdir-doc3': {
        id: 'subdir-doc3',
        title: 'Document 3',
        source: 'subdir/doc3.md',
        permalink: 'docs/subdir/doc3.html',
        language: 'en',
      },
    };
    const customMdToHtml = metadataUtils.mdToHtml(customMetadata, siteConfig);
    const content3 = docs.mdToHtmlify(
      rawContent3,
      customMdToHtml,
      customMetadata['subdir-doc3'],
    );
    expect(content3).toContain('/docs/subdir/doc3');
    expect(content3).not.toContain('subdir/doc3.md');
    expect(content3).toMatchSnapshot();
    expect(content3).not.toEqual(rawContent3);
  });

  test('transforms reference links', () => {
    const contentRefLinks = docs.mdToHtmlify(
      rawContentRefLinks,
      mdToHtml,
      Metadata['en-reflinks'],
    );
    expect(contentRefLinks).toContain('/docs/en/next/');
    expect(contentRefLinks).toMatchSnapshot();
    expect(contentRefLinks).not.toEqual(rawContentRefLinks);
  });
});

describe('getFile', () => {
  const fakeContent = {
    'v1/website/translated_docs/ko/doc1.md': '이건 가짜 야',
    'v1/website/versioned_docs/version-1.0.0/doc2.md': 'Document 2 is not good',
    'v1/website/translated_docs/ko/version-1.0.0/doc1.md':
      '이것은 오래된 가짜입니다.',
    'docs/doc1.md': 'Just another document',
  };
  fs.existsSync = jest.fn().mockReturnValue(true);
  fs.readFileSync = jest.fn().mockImplementation(file => {
    const fakePath = file.replace(
      process.cwd().replace(/v1\/website\/?$/, ''),
      '',
    );
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
      fakeContent['v1/website/translated_docs/ko/doc1.md'],
    );
  });

  test('versioned docs', () => {
    const metadata = Metadata['en-version-1.0.0-doc2'];
    expect(docs.getFile(metadata)).toEqual(
      fakeContent['v1/website/versioned_docs/version-1.0.0/doc2.md'],
    );
  });

  test('translated & versioned docs', () => {
    const metadata = Metadata['ko-version-1.0.0-doc1'];
    expect(docs.getFile(metadata)).toEqual(
      fakeContent['v1/website/translated_docs/ko/version-1.0.0/doc1.md'],
    );
  });

  test('normal docs', () => {
    const metadata = Metadata['en-doc1'];
    expect(docs.getFile(metadata)).toEqual(fakeContent['docs/doc1.md']);
  });
});

describe('replaceAssetsLink', () => {
  test('transform document with valid assets link', () => {
    const content1 = replaceAssetsLink(rawContent1, 'docs');
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
    const content2 = replaceAssetsLink(rawContent2, 'docs');
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
