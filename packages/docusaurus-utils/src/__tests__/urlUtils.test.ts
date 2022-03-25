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
