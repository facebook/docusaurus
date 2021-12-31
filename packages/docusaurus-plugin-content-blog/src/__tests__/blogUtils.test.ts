/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {parseBlogFileName} from '../blogUtils';

describe('parseBlogFileName', () => {
  test('parse file', () => {
    expect(parseBlogFileName('some-post.md')).toEqual({
      date: undefined,
      text: 'some-post',
      slug: '/some-post',
    });
  });

  test('parse folder', () => {
    expect(parseBlogFileName('some-post/index.md')).toEqual({
      date: undefined,
      text: 'some-post',
      slug: '/some-post',
    });
  });

  test('parse nested file', () => {
    expect(parseBlogFileName('some-post/some-file.md')).toEqual({
      date: undefined,
      text: 'some-post/some-file',
      slug: '/some-post/some-file',
    });
  });

  test('parse nested folder', () => {
    expect(parseBlogFileName('some-post/some-subfolder/index.md')).toEqual({
      date: undefined,
      text: 'some-post/some-subfolder',
      slug: '/some-post/some-subfolder',
    });
  });

  test('parse file respecting date convention', () => {
    expect(
      parseBlogFileName('2021-05-12-announcing-docusaurus-two-beta.md'),
    ).toEqual({
      date: new Date('2021-05-12Z'),
      text: 'announcing-docusaurus-two-beta',
      slug: '/2021/05/12/announcing-docusaurus-two-beta',
    });
  });

  test('parse folder name respecting date convention', () => {
    expect(
      parseBlogFileName('2021-05-12-announcing-docusaurus-two-beta/index.md'),
    ).toEqual({
      date: new Date('2021-05-12Z'),
      text: 'announcing-docusaurus-two-beta',
      slug: '/2021/05/12/announcing-docusaurus-two-beta',
    });
  });

  test('parse folder tree respecting date convention', () => {
    expect(
      parseBlogFileName('2021/05/12/announcing-docusaurus-two-beta/index.md'),
    ).toEqual({
      date: new Date('2021-05-12Z'),
      text: 'announcing-docusaurus-two-beta',
      slug: '/2021/05/12/announcing-docusaurus-two-beta',
    });
  });

  test('parse folder name/tree (mixed) respecting date convention', () => {
    expect(
      parseBlogFileName('2021/05-12-announcing-docusaurus-two-beta/index.md'),
    ).toEqual({
      date: new Date('2021-05-12Z'),
      text: 'announcing-docusaurus-two-beta',
      slug: '/2021/05/12/announcing-docusaurus-two-beta',
    });
  });

  test('parse nested folder tree respecting date convention', () => {
    expect(
      parseBlogFileName(
        '2021/05/12/announcing-docusaurus-two-beta/subfolder/subfile.md',
      ),
    ).toEqual({
      date: new Date('2021-05-12Z'),
      text: 'announcing-docusaurus-two-beta/subfolder/subfile',
      slug: '/2021/05/12/announcing-docusaurus-two-beta/subfolder/subfile',
    });
  });
});
