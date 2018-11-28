/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  fileToPath,
  fileToComponentName,
  idx,
  getSubFolder,
  normalizeUrl,
} from '@lib/load/utils';

describe('load utils', () => {
  test('fileToComponentName', () => {
    const asserts = {
      'index.md': 'MDIndex',
      'hello/index.md': 'MDHelloIndex',
      'foo.md': 'MDFoo',
      'foo-bar.md': 'MDFooBar',
      'index.js': 'JSIndex',
      'foobar.js': 'JSFoobar',
      'docusaurus/index.js': 'JSDocusaurusIndex',
      '234.md': 'MD234',
      '2018-07-08-test.md': 'MD20180708Test',
      '%asd.md': 'MDAsd',
    };
    Object.keys(asserts).forEach(file => {
      expect(fileToComponentName(file)).toBe(asserts[file]);
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

  test('idx', () => {
    const a = {};
    const b = {hello: 'world'};
    const env = {
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
    expect(idx(a, [('b', 'c')])).toBeUndefined();
    expect(idx(b, ['hello'])).toEqual('world');
    expect(idx(b, 'hello')).toEqual('world');
    expect(idx(env, 'typo')).toBeUndefined();
    expect(idx(env, 'versioning')).toEqual({
      enabled: false,
      versions: [],
    });
    expect(idx(env, ['translation', 'enabled'])).toEqual(true);
    expect(idx(env, ['translation', variable]).map(lang => lang.tag)).toEqual([
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
    ];
    asserts.forEach(testCase => {
      expect(normalizeUrl(testCase.input)).toBe(testCase.output);
    });
  });
});
