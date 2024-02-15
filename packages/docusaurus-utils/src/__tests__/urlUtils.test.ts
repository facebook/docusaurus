/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  normalizeUrl,
  getEditUrl,
  fileToPath,
  isValidPathname,
  addTrailingSlash,
  addLeadingSlash,
  removeTrailingSlash,
  resolvePathname,
  encodePath,
  buildSshUrl,
  buildHttpsUrl,
  hasSSHProtocol,
  parseURLPath,
  serializeURLPath,
} from '../urlUtils';

describe('normalizeUrl', () => {
  it('normalizes urls correctly', () => {
    const asserts = [
      {
        input: [],
        output: '',
      },
      {
        input: ['/', ''],
        output: '/',
      },
      {
        input: ['', '/'],
        output: '/',
      },
      {
        input: ['/'],
        output: '/',
      },
      {
        input: [''],
        output: '',
      },
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
        input: ['/test/', '/', 'ro', 'doc1'],
        output: '/test/ro/doc1',
      },
      {
        input: ['/', '/', '2020/02/29/leap-day'],
        output: '/2020/02/29/leap-day',
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
      {
        input: ['/', '', 'hello', '', '/', '/', '', '/', '/world'],
        output: '/hello/world',
      },
      {
        input: ['', '', '/tt', 'ko', 'hello'],
        output: '/tt/ko/hello',
      },
      {
        input: ['', '///hello///', '', '///world'],
        output: '/hello/world',
      },
      {
        input: ['', '/hello/', ''],
        output: '/hello/',
      },
      {
        input: ['', '/', ''],
        output: '/',
      },
      {
        input: ['///', '///'],
        output: '/',
      },
      {
        input: ['/', '/hello/world/', '///'],
        output: '/hello/world/',
      },
      {
        input: ['file://', '//hello/world/'],
        output: 'file:///hello/world/',
      },
      {
        input: ['file:', '/hello/world/'],
        output: 'file:///hello/world/',
      },
      {
        input: ['file://', '/hello/world/'],
        output: 'file:///hello/world/',
      },
      {
        input: ['file:', 'hello/world/'],
        output: 'file://hello/world/',
      },
    ];
    asserts.forEach((testCase) => {
      expect(normalizeUrl(testCase.input)).toBe(testCase.output);
    });

    expect(() =>
      // @ts-expect-error undefined for test
      normalizeUrl(['http:example.com', undefined]),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Url must be a string. Received undefined"`,
    );
  });
});

describe('getEditUrl', () => {
  it('returns right path', () => {
    expect(
      getEditUrl('foo/bar.md', 'https://github.com/facebook/docusaurus'),
    ).toBe('https://github.com/facebook/docusaurus/foo/bar.md');
    expect(
      getEditUrl('foo/你好.md', 'https://github.com/facebook/docusaurus'),
    ).toBe('https://github.com/facebook/docusaurus/foo/你好.md');
  });
  it('always returns valid URL', () => {
    expect(
      getEditUrl('foo\\你好.md', 'https://github.com/facebook/docusaurus'),
    ).toBe('https://github.com/facebook/docusaurus/foo/你好.md');
  });
  it('returns undefined for undefined', () => {
    expect(getEditUrl('foo/bar.md')).toBeUndefined();
  });
});

describe('fileToPath', () => {
  it('works', () => {
    const asserts: {[key: string]: string} = {
      'index.md': '/',
      'hello/index.md': '/hello/',
      'foo.md': '/foo',
      'foo/bar.md': '/foo/bar',
      'index.js': '/',
      'hello/index.js': '/hello/',
      'foo.js': '/foo',
      'foo/bar.js': '/foo/bar',
    };
    Object.keys(asserts).forEach((file) => {
      expect(fileToPath(file)).toBe(asserts[file]);
    });
  });
});

describe('isValidPathname', () => {
  it('works', () => {
    expect(isValidPathname('/')).toBe(true);
    expect(isValidPathname('/hey')).toBe(true);
    expect(isValidPathname('/hey/ho')).toBe(true);
    expect(isValidPathname('/hey/ho/')).toBe(true);
    expect(isValidPathname('/hey/h%C3%B4/')).toBe(true);
    expect(isValidPathname('/hey///ho///')).toBe(true); // Unexpected but valid
    expect(isValidPathname('/hey/héllô you')).toBe(true);

    expect(isValidPathname('')).toBe(false);
    expect(isValidPathname('hey')).toBe(false);
    expect(isValidPathname('/hey?qs=ho')).toBe(false);
    expect(isValidPathname('https://fb.com/hey')).toBe(false);
    expect(isValidPathname('//hey')).toBe(false);
    expect(isValidPathname('////')).toBe(false);
  });
});

describe('addTrailingSlash', () => {
  it('is no-op for path with trailing slash', () => {
    expect(addTrailingSlash('/abcd/')).toBe('/abcd/');
  });
  it('adds / for path without trailing slash', () => {
    expect(addTrailingSlash('/abcd')).toBe('/abcd/');
  });
});

describe('addLeadingSlash', () => {
  it('is no-op for path with leading slash', () => {
    expect(addLeadingSlash('/abc')).toBe('/abc');
  });
  it('adds / for path without leading slash', () => {
    expect(addLeadingSlash('abc')).toBe('/abc');
  });
});

describe('removeTrailingSlash', () => {
  it('is no-op for path without trailing slash', () => {
    expect(removeTrailingSlash('/abcd')).toBe('/abcd');
  });
  it('removes / for path with trailing slash', () => {
    expect(removeTrailingSlash('/abcd/')).toBe('/abcd');
  });
});

describe('parseURLPath', () => {
  it('parse and resolve pathname', () => {
    expect(parseURLPath('')).toEqual({
      pathname: '/',
      search: undefined,
      hash: undefined,
    });
    expect(parseURLPath('/')).toEqual({
      pathname: '/',
      search: undefined,
      hash: undefined,
    });
    expect(parseURLPath('/page')).toEqual({
      pathname: '/page',
      search: undefined,
      hash: undefined,
    });
    expect(parseURLPath('/dir1/page')).toEqual({
      pathname: '/dir1/page',
      search: undefined,
      hash: undefined,
    });
    expect(parseURLPath('/dir1/dir2/./../page')).toEqual({
      pathname: '/dir1/page',
      search: undefined,
      hash: undefined,
    });
    expect(parseURLPath('/dir1/dir2/../..')).toEqual({
      pathname: '/',
      search: undefined,
      hash: undefined,
    });
    expect(parseURLPath('/dir1/dir2/../../..')).toEqual({
      pathname: '/',
      search: undefined,
      hash: undefined,
    });
    expect(parseURLPath('./dir1/dir2./../page', '/dir3/dir4/page2')).toEqual({
      pathname: '/dir3/dir4/dir1/page',
      search: undefined,
      hash: undefined,
    });
  });

  it('parse query string', () => {
    expect(parseURLPath('/page')).toEqual({
      pathname: '/page',
      search: undefined,
      hash: undefined,
    });
    expect(parseURLPath('/page?')).toEqual({
      pathname: '/page',
      search: '',
      hash: undefined,
    });
    expect(parseURLPath('/page?test')).toEqual({
      pathname: '/page',
      search: 'test',
      hash: undefined,
    });
    expect(parseURLPath('/page?age=42&great=true')).toEqual({
      pathname: '/page',
      search: 'age=42&great=true',
      hash: undefined,
    });
  });

  it('parse anchor', () => {
    expect(parseURLPath('#anchor')).toEqual({
      pathname: '/',
      search: undefined,
      hash: 'anchor',
    });
    expect(parseURLPath('#anchor', '/page')).toEqual({
      pathname: '/page',
      search: undefined,
      hash: 'anchor',
    });
    expect(parseURLPath('#')).toEqual({
      pathname: '/',
      search: undefined,
      hash: '',
    });
    expect(parseURLPath('#', '/page')).toEqual({
      pathname: '/page',
      search: undefined,
      hash: '',
    });
  });

  it('parse hash', () => {
    expect(parseURLPath('/page')).toEqual({
      pathname: '/page',
      search: undefined,
      hash: undefined,
    });
    expect(parseURLPath('/page#')).toEqual({
      pathname: '/page',
      search: undefined,
      hash: '',
    });
    expect(parseURLPath('/page#anchor')).toEqual({
      pathname: '/page',
      search: undefined,
      hash: 'anchor',
    });
  });

  it('parse fancy real-world edge cases', () => {
    expect(parseURLPath('/page?#')).toEqual({
      pathname: '/page',
      search: '',
      hash: '',
    });
    expect(
      parseURLPath('dir1/dir2/../page?age=42#anchor', '/dir3/page2'),
    ).toEqual({
      pathname: '/dir3/dir1/page',
      search: 'age=42',
      hash: 'anchor',
    });
  });
});

describe('serializeURLPath', () => {
  function test(input: string, base?: string, expectedOutput?: string) {
    expect(serializeURLPath(parseURLPath(input, base))).toEqual(
      expectedOutput ?? input,
    );
  }

  it('works for already resolved paths', () => {
    test('/');
    test('/dir1/page');
    test('/dir1/page?');
    test('/dir1/page#');
    test('/dir1/page?#');
    test('/dir1/page?age=42#anchor');
  });

  it('works for relative paths', () => {
    test('', undefined, '/');
    test('', '/dir1/dir2/page2', '/dir1/dir2/page2');
    test('page', '/dir1/dir2/page2', '/dir1/dir2/page');
    test('../page', '/dir1/dir2/page2', '/dir1/page');
    test('/dir1/dir2/../page', undefined, '/dir1/page');
    test(
      '/dir1/dir2/../page?age=42#anchor',
      undefined,
      '/dir1/page?age=42#anchor',
    );
  });
});

describe('resolvePathname', () => {
  it('works', () => {
    // These tests are directly copied from https://github.com/mjackson/resolve-pathname/blob/master/modules/__tests__/resolvePathname-test.js
    // Maybe we want to wrap that logic in the future?
    expect(resolvePathname('c')).toBe('c');
    expect(resolvePathname('c', 'a/b')).toBe('a/c');
    expect(resolvePathname('/c', '/a/b')).toBe('/c');
    expect(resolvePathname('', '/a/b')).toBe('/a/b');
    expect(resolvePathname('../c', '/a/b')).toBe('/c');
    expect(resolvePathname('c', '/a/b')).toBe('/a/c');
    expect(resolvePathname('c', '/a/')).toBe('/a/c');
    expect(resolvePathname('..', '/a/b')).toBe('/');
  });
});

describe('encodePath', () => {
  it('works', () => {
    expect(encodePath('a/foo/')).toBe('a/foo/');
    // cSpell:ignore cfoo
    expect(encodePath('a/<foo>/')).toBe('a/%3Cfoo%3E/');
    expect(encodePath('a/你好/')).toBe('a/%E4%BD%A0%E5%A5%BD/');
  });
});

describe('buildSshUrl', () => {
  it('builds a normal ssh url', () => {
    const url = buildSshUrl('github.com', 'facebook', 'docusaurus');
    expect(url).toBe('git@github.com:facebook/docusaurus.git');
  });
  it('builds a ssh url with port', () => {
    const url = buildSshUrl('github.com', 'facebook', 'docusaurus', '422');
    expect(url).toBe('ssh://git@github.com:422/facebook/docusaurus.git');
  });
});

describe('buildHttpsUrl', () => {
  it('builds a normal http url', () => {
    const url = buildHttpsUrl(
      'user:pass',
      'github.com',
      'facebook',
      'docusaurus',
    );
    expect(url).toBe('https://user:pass@github.com/facebook/docusaurus.git');
  });
  it('builds a normal http url with port', () => {
    const url = buildHttpsUrl(
      'user:pass',
      'github.com',
      'facebook',
      'docusaurus',
      '5433',
    );
    expect(url).toBe(
      'https://user:pass@github.com:5433/facebook/docusaurus.git',
    );
  });
});

describe('hasSSHProtocol', () => {
  it('recognizes explicit SSH protocol', () => {
    const url = 'ssh://git@github.com:422/facebook/docusaurus.git';
    expect(hasSSHProtocol(url)).toBe(true);
  });

  it('recognizes implied SSH protocol', () => {
    const url = 'git@github.com:facebook/docusaurus.git';
    expect(hasSSHProtocol(url)).toBe(true);
  });

  it('does not recognize HTTPS with credentials', () => {
    const url = 'https://user:pass@github.com/facebook/docusaurus.git';
    expect(hasSSHProtocol(url)).toBe(false);
  });

  it('does not recognize plain HTTPS URL', () => {
    const url = 'https://github.com:5433/facebook/docusaurus.git';
    expect(hasSSHProtocol(url)).toBe(false);
  });
});
