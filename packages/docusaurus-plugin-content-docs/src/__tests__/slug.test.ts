/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getSlug from '../slug';

describe('getSlug', () => {
  test('should default to dirname/id', () => {
    expect(
      getSlug({
        baseID: 'doc',
        source: '@site/docs/dir/doc.md',
        sourceDirName: '/dir',
      }),
    ).toEqual('/dir/doc');
    expect(
      getSlug({
        baseID: 'doc',
        source: '@site/docs/dir/subdir/doc.md',
        sourceDirName: '/dir/subdir',
      }),
    ).toEqual('/dir/subdir/doc');
  });

  test('should handle conventional doc indexes', () => {
    expect(
      getSlug({
        baseID: 'doc',
        source: '@site/docs/dir/subdir/index.md',
        sourceDirName: '/dir/subdir',
      }),
    ).toEqual('/dir/subdir/');
    expect(
      getSlug({
        baseID: 'doc',
        source: '@site/docs/dir/subdir/inDEx.mdx',
        sourceDirName: '/dir/subdir',
      }),
    ).toEqual('/dir/subdir/');
    expect(
      getSlug({
        baseID: 'doc',
        source: '@site/docs/dir/subdir/readme.md',
        sourceDirName: '/dir/subdir',
      }),
    ).toEqual('/dir/subdir/');
    expect(
      getSlug({
        baseID: 'doc',
        source: '@site/docs/dir/subdir/reADMe.mdx',
        sourceDirName: '/dir/subdir',
      }),
    ).toEqual('/dir/subdir/');
    expect(
      getSlug({
        baseID: 'doc',
        source: '@site/docs/dir/subdir/subdir.md',
        sourceDirName: '/dir/subdir',
      }),
    ).toEqual('/dir/subdir/');
    expect(
      getSlug({
        baseID: 'doc',
        source: '@site/docs/dir/subdir/suBDir.mdx',
        sourceDirName: '/dir/subdir',
      }),
    ).toEqual('/dir/subdir/');
  });

  test('should ignore conventional doc index when explicit slug frontmatter is provided', () => {
    expect(
      getSlug({
        baseID: 'doc',
        source: '@site/docs/dir/subdir/index.md',
        sourceDirName: '/dir/subdir',
        frontmatterSlug: '/my/frontMatterSlug',
      }),
    ).toEqual('/my/frontMatterSlug');
  });

  test('can strip dir number prefixes', () => {
    expect(
      getSlug({
        baseID: 'doc',
        source: '@site/docs/001-dir1/002-dir2/doc.md',
        sourceDirName: '/001-dir1/002-dir2',
        stripDirNumberPrefixes: true,
      }),
    ).toEqual('/dir1/dir2/doc');
    expect(
      getSlug({
        baseID: 'doc',
        source: '@site/docs/001-dir1/002-dir2/doc.md',
        sourceDirName: '/001-dir1/002-dir2',
        stripDirNumberPrefixes: false,
      }),
    ).toEqual('/001-dir1/002-dir2/doc');
  });

  // See https://github.com/facebook/docusaurus/issues/3223
  test('should handle special chars in doc path', () => {
    expect(
      getSlug({
        baseID: 'my dôc',
        source: '@site/docs/dir with spâce/hey $hello/doc.md',
        sourceDirName: '/dir with spâce/hey $hello',
      }),
    ).toEqual('/dir with spâce/hey $hello/my dôc');
  });

  test('should handle current dir', () => {
    expect(
      getSlug({baseID: 'doc', source: '@site/docs/doc.md', sourceDirName: '.'}),
    ).toEqual('/doc');
    expect(
      getSlug({baseID: 'doc', source: '@site/docs/doc.md', sourceDirName: '/'}),
    ).toEqual('/doc');
  });

  test('should resolve absolute slug frontmatter', () => {
    expect(
      getSlug({
        baseID: 'any',
        source: '@site/docs/doc.md',
        sourceDirName: '.',
        frontmatterSlug: '/abc/def',
      }),
    ).toEqual('/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        source: '@site/docs/any/doc.md',
        sourceDirName: './any',
        frontmatterSlug: '/abc/def',
      }),
    ).toEqual('/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        source: '@site/docs/any/any/doc.md',
        sourceDirName: './any/any',
        frontmatterSlug: '/abc/def',
      }),
    ).toEqual('/abc/def');
  });

  test('should resolve relative slug frontmatter', () => {
    expect(
      getSlug({
        baseID: 'any',
        source: '@site/docs/doc.md',
        sourceDirName: '.',
        frontmatterSlug: 'abc/def',
      }),
    ).toEqual('/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        source: '@site/docs/dir/doc.md',
        sourceDirName: '/dir',
        frontmatterSlug: 'abc/def',
      }),
    ).toEqual('/dir/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        source: '@site/docs/unslashedDir/doc.md',
        sourceDirName: 'unslashedDir',
        frontmatterSlug: 'abc/def',
      }),
    ).toEqual('/unslashedDir/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        source: '@site/docs/dir/subdir/doc.md',
        sourceDirName: 'dir/subdir',
        frontmatterSlug: 'abc/def',
      }),
    ).toEqual('/dir/subdir/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        source: '@site/docs/dir/doc.md',
        sourceDirName: '/dir',
        frontmatterSlug: './abc/def',
      }),
    ).toEqual('/dir/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        source: '@site/docs/dir/doc.md',
        sourceDirName: '/dir',
        frontmatterSlug: './abc/../def',
      }),
    ).toEqual('/dir/def');
    expect(
      getSlug({
        baseID: 'any',
        source: '@site/docs/dir/subdir/doc.md',
        sourceDirName: '/dir/subdir',
        frontmatterSlug: '../abc/def',
      }),
    ).toEqual('/dir/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        source: '@site/docs/dir/subdirdoc.md',
        sourceDirName: '/dir/subdir',
        frontmatterSlug: '../../../../../abc/../def',
      }),
    ).toEqual('/def');
  });
});
