/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it, vi} from 'vitest';
import path from 'path';
import {
  isNameTooLong,
  shortName,
  escapePath,
  posixPath,
  aliasedSitePath,
  toMessageRelativeFilePath,
  addTrailingPathSeparator,
  aliasedSitePathToRelativePath,
  fromGitPathToNativePath,
} from '../pathUtils';

describe('isNameTooLong', () => {
  it('works', () => {
    const asserts = {
      '': false,
      'foo-bar-096': false,
      'foo-bar-1df': false,
      'endi-lie-9fa': false,
      'endi-lie-fd3': false,
      'yangshun-tay-48d': false,
      'yangshun-tay-f3b': false,
      'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-d46': true,
      'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-test-1-test-2-787': true,
      // Every Han zi is three bytes
      字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字:
        {apfs: false, xfs: true},
    };
    const oldProcessPlatform = process.platform;
    Object.defineProperty(process, 'platform', {value: 'darwin'});
    (Object.keys(asserts) as (keyof typeof asserts)[]).forEach((file) => {
      const expected = asserts[file];
      expect(isNameTooLong(file)).toBe(
        typeof expected === 'boolean' ? expected : expected.apfs,
      );
    });
    Object.defineProperty(process, 'platform', {value: 'win32'});
    (Object.keys(asserts) as (keyof typeof asserts)[]).forEach((file) => {
      const expected = asserts[file];
      expect(isNameTooLong(file)).toBe(
        typeof expected === 'boolean' ? expected : expected.apfs,
      );
    });
    Object.defineProperty(process, 'platform', {value: 'android'});
    (Object.keys(asserts) as (keyof typeof asserts)[]).forEach((file) => {
      const expected = asserts[file];
      expect(isNameTooLong(file)).toBe(
        typeof expected === 'boolean' ? expected : expected.xfs,
      );
    });
    Object.defineProperty(process, 'platform', {value: oldProcessPlatform});
  });
});

describe('shortName', () => {
  it('works', () => {
    const asserts = {
      '': '',
      'foo-bar': 'foo-bar',
      'endi-lie': 'endi-lie',
      'yangshun-tay': 'yangshun-tay',
      'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar':
        'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-',
      'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-test-1-test-2':
        'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-test-1-test-',
      字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字:
        {
          apfs: '字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字',
          // This is pretty bad (a character clipped in half), but I doubt if it
          // ever happens
          xfs: '字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字�',
        },
    };
    const oldProcessPlatform = process.platform;
    Object.defineProperty(process, 'platform', {value: 'darwin'});
    (Object.keys(asserts) as (keyof typeof asserts)[]).forEach((file) => {
      const expected = asserts[file];
      expect(shortName(file)).toBe(
        typeof expected === 'string' ? expected : expected.apfs,
      );
    });
    Object.defineProperty(process, 'platform', {value: 'win32'});
    (Object.keys(asserts) as (keyof typeof asserts)[]).forEach((file) => {
      const expected = asserts[file];
      expect(shortName(file)).toBe(
        typeof expected === 'string' ? expected : expected.apfs,
      );
    });
    Object.defineProperty(process, 'platform', {value: 'android'});
    (Object.keys(asserts) as (keyof typeof asserts)[]).forEach((file) => {
      const expected = asserts[file];
      expect(shortName(file)).toBe(
        typeof expected === 'string' ? expected : expected.xfs,
      );
    });
    Object.defineProperty(process, 'platform', {value: oldProcessPlatform});
  });

  // Based on https://github.com/gatsbyjs/gatsby/pull/21518/files

  const SHORT_PATH = `/short/path/without/trailing/slash`;
  const VERY_LONG_PATH = `/${`x`.repeat(256)}/`;
  const VERY_LONG_PATH_NON_LATIN = `/${`あ`.repeat(255)}/`;

  it('truncates long paths correctly', () => {
    const truncatedPathLatin = shortName(VERY_LONG_PATH);
    const truncatedPathNonLatin = shortName(VERY_LONG_PATH_NON_LATIN);
    expect(truncatedPathLatin.length).toBeLessThanOrEqual(255);
    expect(truncatedPathNonLatin.length).toBeLessThanOrEqual(255);
  });

  it('does not truncate short paths', () => {
    const truncatedPath = shortName(SHORT_PATH);
    expect(truncatedPath).toEqual(SHORT_PATH);
  });
});

describe('toMessageRelativeFilePath', () => {
  it('works', () => {
    vi.spyOn(process, 'cwd').mockImplementationOnce(() =>
      path.join(__dirname, '..'),
    );
    expect(toMessageRelativeFilePath(path.join(__dirname, 'foo/bar.js'))).toBe(
      '__tests__/foo/bar.js',
    );
  });
});

describe('escapePath', () => {
  it('works', () => {
    const asserts: {[key: string]: string} = {
      'c:/aaaa\\bbbb': 'c:/aaaa\\\\bbbb',
      'c:\\aaaa\\bbbb\\★': 'c:\\\\aaaa\\\\bbbb\\\\★',
      '\\\\?\\c:\\aaaa\\bbbb': '\\\\\\\\?\\\\c:\\\\aaaa\\\\bbbb',
      'c:\\aaaa\\bbbb': 'c:\\\\aaaa\\\\bbbb',
      'foo\\bar': 'foo\\\\bar',
      'foo\\bar/lol': 'foo\\\\bar/lol',
      'website\\docs/**/*.{md,mdx}': 'website\\\\docs/**/*.{md,mdx}',
    };
    Object.keys(asserts).forEach((file) => {
      expect(escapePath(file)).toBe(asserts[file]);
    });
  });
});

describe('posixPath', () => {
  it('works', () => {
    const asserts: {[key: string]: string} = {
      'c:/aaaa\\bbbb': 'c:/aaaa/bbbb',
      'c:\\aaaa\\bbbb\\★': 'c:/aaaa/bbbb/★',
      '\\\\?\\c:\\aaaa\\bbbb': '\\\\?\\c:\\aaaa\\bbbb',
      'c:\\aaaa\\bbbb': 'c:/aaaa/bbbb',
      'foo\\bar': 'foo/bar',
      'foo\\bar/lol': 'foo/bar/lol',
      'website\\docs/**/*.{md,mdx}': 'website/docs/**/*.{md,mdx}',
    };
    Object.keys(asserts).forEach((file) => {
      expect(posixPath(file)).toBe(asserts[file]);
    });
  });
});

describe('aliasedSitePath', () => {
  it('works', () => {
    const asserts: {[key: string]: string} = {
      'user/website/docs/asd.md': '@site/docs/asd.md',
      'user/website/versioned_docs/foo/bar.md':
        '@site/versioned_docs/foo/bar.md',
      'user/docs/test.md': '@site/../docs/test.md',
    };
    Object.keys(asserts).forEach((file) => {
      expect(posixPath(aliasedSitePath(file, 'user/website'))).toBe(
        asserts[file],
      );
    });
  });
});

describe('aliasedSitePathToRelativePath', () => {
  it('works', () => {
    expect(aliasedSitePathToRelativePath('@site/site/relative/path')).toBe(
      'site/relative/path',
    );
  });

  it('is fail-fast', () => {
    expect(() => aliasedSitePathToRelativePath('/site/relative/path')).toThrow(
      /Unexpected, filePath is not site-aliased: \/site\/relative\/path/,
    );
  });
});

describe('addTrailingPathSeparator', () => {
  it('works', () => {
    expect(addTrailingPathSeparator('foo')).toEqual(
      process.platform === 'win32' ? 'foo\\' : 'foo/',
    );
    expect(addTrailingPathSeparator('foo/')).toEqual(
      process.platform === 'win32' ? 'foo\\' : 'foo/',
    );
  });
});

describe('fromGitPathToNativePath', () => {
  function withPlatform<T>(platform: NodeJS.Platform, fn: () => T): T {
    const oldProcessPlatform = process.platform;
    Object.defineProperty(process, 'platform', {value: platform});
    try {
      return fn();
    } finally {
      Object.defineProperty(process, 'platform', {value: oldProcessPlatform});
    }
  }

  it('converts MSYS/Cygwin drive paths to native Windows paths on Windows', () => {
    withPlatform('win32', () => {
      // See https://github.com/facebook/docusaurus/issues/11920
      expect(fromGitPathToNativePath('/p/projets/my-repo')).toBe(
        'P:\\projets\\my-repo',
      );
      expect(fromGitPathToNativePath('/c/Users/me/site')).toBe(
        'C:\\Users\\me\\site',
      );
      expect(fromGitPathToNativePath('/c')).toBe('C:\\');
      expect(fromGitPathToNativePath('/c/')).toBe('C:\\');
    });
  });

  it('leaves native Windows, UNC and posix paths unchanged on Windows', () => {
    withPlatform('win32', () => {
      expect(fromGitPathToNativePath('C:\\Users\\me\\site')).toBe(
        'C:\\Users\\me\\site',
      );
      expect(fromGitPathToNativePath('C:/Users/me/site')).toBe(
        'C:/Users/me/site',
      );
      expect(fromGitPathToNativePath('//server/share')).toBe('//server/share');
      // A real posix dir whose top-level segment is more than one character
      // is not a drive mount and must not be rewritten.
      expect(fromGitPathToNativePath('/home/me/site')).toBe('/home/me/site');
    });
  });

  it('returns the path unchanged on non-Windows platforms', () => {
    withPlatform('linux', () => {
      // On Unix, /c/... is a perfectly valid absolute path and must be kept.
      expect(fromGitPathToNativePath('/c/Users/me/site')).toBe(
        '/c/Users/me/site',
      );
      expect(fromGitPathToNativePath('/home/me/site')).toBe('/home/me/site');
    });
  });
});
