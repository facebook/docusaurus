/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  fileToPath,
  docuHash,
  genComponentName,
  genChunkName,
  idx,
  getSubFolder,
  normalizeUrl,
  posixPath,
  objectWithKeySorted,
  aliasedSitePath,
} from '../index';

describe('load utils', () => {
  test('aliasedSitePath', () => {
    const asserts = {
      'user/website/docs/asd.md': '@site/docs/asd.md',
      'user/website/versioned_docs/foo/bar.md':
        '@site/versioned_docs/foo/bar.md',
      'user/docs/test.md': '@site/../docs/test.md',
    };
    Object.keys(asserts).forEach(file => {
      expect(aliasedSitePath(file, 'user/website')).toBe(asserts[file]);
    });
  });

  test('posixPath', () => {
    const asserts = {
      'c:/aaaa\\bbbb': 'c:/aaaa/bbbb',
      'c:\\aaaa\\bbbb\\★': 'c:\\aaaa\\bbbb\\★',
      '\\\\?\\c:\\aaaa\\bbbb': '\\\\?\\c:\\aaaa\\bbbb',
      'c:\\aaaa\\bbbb': 'c:/aaaa/bbbb',
      'foo\\bar': 'foo/bar',
      'foo\\bar/lol': 'foo/bar/lol',
      'website\\docs/**/*.{md,mdx}': 'website/docs/**/*.{md,mdx}',
    };
    Object.keys(asserts).forEach(file => {
      expect(posixPath(file)).toBe(asserts[file]);
    });
  });

  test('genComponentName', () => {
    const asserts = {
      '/': 'index',
      '/foo-bar': 'FooBar096',
      '/foo/bar': 'FooBar1Df',
      '/blog/2017/12/14/introducing-docusaurus':
        'Blog20171214IntroducingDocusaurus8D2',
      '/blog/2017/12/14-introducing-docusaurus':
        'Blog20171214IntroducingDocusaurus0Bc',
      '/blog/201712/14-introducing-docusaurus':
        'Blog20171214IntroducingDocusaurusA93',
    };
    Object.keys(asserts).forEach(file => {
      expect(genComponentName(file)).toBe(asserts[file]);
    });
  });

  test('docuHash', () => {
    const asserts = {
      '': '-d41',
      '/': 'index',
      '/foo-bar': 'foo-bar-096',
      '/foo/bar': 'foo-bar-1df',
      '/endi/lie': 'endi-lie-9fa',
      '/endi-lie': 'endi-lie-fd3',
      '/yangshun/tay': 'yangshun-tay-48d',
      '/yangshun-tay': 'yangshun-tay-f3b',
    };
    Object.keys(asserts).forEach(file => {
      expect(docuHash(file)).toBe(asserts[file]);
    });
  });

  test('fileToPath', () => {
    const asserts = {
      'index.md': '/',
      'hello/index.md': '/hello/',
      'foo.md': '/foo',
      'foo/bar.md': '/foo/bar',
      'index.js': '/',
      'hello/index.js': '/hello/',
      'foo.js': '/foo',
      'foo/bar.js': '/foo/bar',
    };
    Object.keys(asserts).forEach(file => {
      expect(fileToPath(file)).toBe(asserts[file]);
    });
  });

  test('objectWithKeySorted', () => {
    const obj = {
      '/docs/adding-blog': '4',
      '/docs/versioning': '5',
      '/': '1',
      '/blog/2018': '3',
      '/youtube': '7',
      '/users/en/': '6',
      '/blog': '2',
    };
    expect(objectWithKeySorted(obj)).toMatchInlineSnapshot(`
      Object {
        "/": "1",
        "/blog": "2",
        "/blog/2018": "3",
        "/docs/adding-blog": "4",
        "/docs/versioning": "5",
        "/users/en/": "6",
        "/youtube": "7",
      }
    `);
    const obj2 = {
      b: 'foo',
      c: 'bar',
      a: 'baz',
    };
    expect(objectWithKeySorted(obj2)).toMatchInlineSnapshot(`
      Object {
        "a": "baz",
        "b": "foo",
        "c": "bar",
      }
    `);
  });

  test('genChunkName', () => {
    const firstAssert = {
      '/docs/adding-blog': 'docs-adding-blog-062',
      '/docs/versioning': 'docs-versioning-8a8',
      '/': 'index',
      '/blog/2018/04/30/How-I-Converted-Profilo-To-Docusaurus':
        'blog-2018-04-30-how-i-converted-profilo-to-docusaurus-4f2',
      '/youtube': 'youtube-429',
      '/users/en/': 'users-en-f7a',
      '/blog': 'blog-c06',
    };
    Object.keys(firstAssert).forEach(str => {
      expect(genChunkName(str)).toBe(firstAssert[str]);
    });

    // Don't allow different chunk name for same path.
    expect(genChunkName('path/is/similar', 'oldPrefix')).toEqual(
      genChunkName('path/is/similar', 'newPrefix'),
    );

    // Even with same preferred name, still different chunk name for different path
    const secondAssert = {
      '/blog/1': 'blog-85-f-089',
      '/blog/2': 'blog-353-489',
    };
    Object.keys(secondAssert).forEach(str => {
      expect(genChunkName(str, undefined, 'blog')).toBe(secondAssert[str]);
    });

    // Only generate short unique id
    const thirdAssert = {
      a: '0cc175b9',
      b: '92eb5ffe',
      c: '4a8a08f0',
      d: '8277e091',
    };
    Object.keys(thirdAssert).forEach(str => {
      expect(genChunkName(str, undefined, undefined, true)).toBe(
        thirdAssert[str],
      );
    });
    expect(genChunkName('d', undefined, undefined, true)).toBe('8277e091');
  });

  test('idx', () => {
    const a = {};
    const b = {hello: 'world'};
    const obj = {
      translation: {
        enabled: true,
        enabledLanguages: [
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
        enabled: false,
        versions: [],
      },
    };
    const test = {arr: [1, 2, 3]};
    const variable = 'enabledLanguages';
    expect(idx(a, ['b', 'c'])).toBeUndefined();
    expect(idx(b, ['hello'])).toEqual('world');
    expect(idx(b, 'hello')).toEqual('world');
    expect(idx(obj, 'typo')).toBeUndefined();
    expect(idx(obj, 'versioning')).toEqual({
      enabled: false,
      versions: [],
    });
    expect(idx(obj, ['translation', 'enabled'])).toEqual(true);
    expect(idx(obj, ['translation', variable]).map(lang => lang.tag)).toEqual([
      'en',
      'ja',
    ]);
    expect(idx(test, ['arr', 0])).toEqual(1);
    expect(idx(undefined)).toBeUndefined();
    expect(idx(null)).toBeNull();
  });

  test('getSubFolder', () => {
    const testA = path.join('folder', 'en', 'test.md');
    const testB = path.join('folder', 'ja', 'test.md');
    const testC = path.join('folder', 'ja', 'en', 'test.md');
    const testD = path.join('docs', 'ro', 'test.md');
    const testE = path.join('docs', 'test.md');
    expect(getSubFolder(testA, 'folder')).toBe('en');
    expect(getSubFolder(testB, 'folder')).toBe('ja');
    expect(getSubFolder(testC, 'folder')).toBe('ja');
    expect(getSubFolder(testD, 'docs')).toBe('ro');
    expect(getSubFolder(testE, 'docs')).toBeNull();
  });

  test('normalizeUrl', () => {
    const asserts = [
      {
        input: ['/', '/'],
        output: '/',
      },
      {
        input: ['/', 'docs'],
        output: '/docs',
      },
      {
        input: ['/', 'docs', 'en', 'next', 'blog'],
        output: '/docs/en/next/blog',
      },
      {
        input: ['/test/', '/docs', 'ro', 'doc1'],
        output: '/test/docs/ro/doc1',
      },
      {
        input: ['', '/', 'ko', 'hello'],
        output: '/ko/hello',
      },
      {
        input: ['hello', 'world'],
        output: 'hello/world',
      },
      {
        input: ['http://www.google.com/', 'foo/bar', '?test=123'],
        output: 'http://www.google.com/foo/bar?test=123',
      },
      {
        input: ['http:', 'www.google.com///', 'foo/bar', '?test=123'],
        output: 'http://www.google.com/foo/bar?test=123',
      },
      {
        input: ['http://foobar.com', '', 'test'],
        output: 'http://foobar.com/test',
      },
      {
        input: ['http://foobar.com', '', 'test', '/'],
        output: 'http://foobar.com/test/',
      },
    ];
    asserts.forEach(testCase => {
      expect(normalizeUrl(testCase.input)).toBe(testCase.output);
    });

    expect(() =>
      normalizeUrl(['http:example.com', undefined]),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Url must be a string. Received undefined"`,
    );
  });
});
