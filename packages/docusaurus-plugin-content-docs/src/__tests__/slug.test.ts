/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getSlug from '../slug';

describe('getSlug', () => {
  test('should default to dirname/id', () => {
    expect(getSlug({baseID: 'doc', dirName: '/dir'})).toEqual('/dir/doc');
    expect(getSlug({baseID: 'doc', dirName: '/dir/subdir'})).toEqual(
      '/dir/subdir/doc',
    );
  });

  // See https://github.com/facebook/docusaurus/issues/3223
  test('should handle special chars in doc path', () => {
    expect(
      getSlug({baseID: 'my dôc', dirName: '/dir with spâce/hey $hello'}),
    ).toEqual('/dir with spâce/hey $hello/my dôc');
  });

  test('should handle current dir', () => {
    expect(getSlug({baseID: 'doc', dirName: '.'})).toEqual('/doc');
    expect(getSlug({baseID: 'doc', dirName: '/'})).toEqual('/doc');
  });

  test('should resolve absolute slug frontmatter', () => {
    expect(
      getSlug({baseID: 'any', dirName: '.', frontmatterSlug: '/abc/def'}),
    ).toEqual('/abc/def');
    expect(
      getSlug({baseID: 'any', dirName: './any', frontmatterSlug: '/abc/def'}),
    ).toEqual('/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        dirName: './any/any',
        frontmatterSlug: '/abc/def',
      }),
    ).toEqual('/abc/def');
  });

  test('should resolve relative slug frontmatter', () => {
    expect(
      getSlug({baseID: 'any', dirName: '.', frontmatterSlug: 'abc/def'}),
    ).toEqual('/abc/def');
    expect(
      getSlug({baseID: 'any', dirName: '/dir', frontmatterSlug: 'abc/def'}),
    ).toEqual('/dir/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        dirName: 'unslashedDir',
        frontmatterSlug: 'abc/def',
      }),
    ).toEqual('/unslashedDir/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        dirName: 'dir/subdir',
        frontmatterSlug: 'abc/def',
      }),
    ).toEqual('/dir/subdir/abc/def');
    expect(
      getSlug({baseID: 'any', dirName: '/dir', frontmatterSlug: './abc/def'}),
    ).toEqual('/dir/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        dirName: '/dir',
        frontmatterSlug: './abc/../def',
      }),
    ).toEqual('/dir/def');
    expect(
      getSlug({
        baseID: 'any',
        dirName: '/dir/subdir',
        frontmatterSlug: '../abc/def',
      }),
    ).toEqual('/dir/abc/def');
    expect(
      getSlug({
        baseID: 'any',
        dirName: '/dir/subdir',
        frontmatterSlug: '../../../../../abc/../def',
      }),
    ).toEqual('/def');
  });
});
