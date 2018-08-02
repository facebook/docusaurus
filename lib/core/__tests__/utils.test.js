/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs');
const utils = require('../utils');

const blogPostWithTruncateContents = fs.readFileSync(
  path.join(__dirname, '__fixtures__', 'blog-post-with-truncate.md'),
  'utf8'
);

const blogPostWithoutTruncateContents = fs.readFileSync(
  path.join(__dirname, '__fixtures__', 'blog-post-without-truncate.md'),
  'utf8'
);

describe('utils', () => {
  test('blogPostHasTruncateMarker', () => {
    expect(utils.blogPostHasTruncateMarker(blogPostWithTruncateContents)).toBe(
      true
    );
    expect(
      utils.blogPostHasTruncateMarker(blogPostWithoutTruncateContents)
    ).toBe(false);
  });

  test('extractBlogPostBeforeTruncate', () => {
    expect(
      utils.extractBlogPostBeforeTruncate(blogPostWithTruncateContents)
    ).toMatchSnapshot();
    expect(
      utils.extractBlogPostBeforeTruncate(blogPostWithoutTruncateContents)
    ).toMatchSnapshot();
  });

  test('getPath', () => {
    expect(utils.getPath('/docs/en/versioning.html', true)).toBe(
      '/docs/en/versioning'
    );
    expect(utils.getPath('/en/users.html', true)).toBe('/en/users');
    expect(utils.getPath('/docs/en/asd/index.html', true)).toBe('/docs/en/asd');
    expect(utils.getPath('/en/help/index.html', true)).toBe('/en/help');
    expect(utils.getPath('/en/help.a.b.c.d.e.html', true)).toBe(
      '/en/help.a.b.c.d.e'
    );
    expect(utils.getPath('/en/help.js', true)).toBe('/en/help');
    expect(utils.getPath('/docs/en/versioning.html', false)).toBe(
      '/docs/en/versioning.html'
    );
    expect(utils.getPath('/en/users.html', false)).toBe('/en/users.html');
  });

  test('removeExtension', () => {
    expect(utils.removeExtension('/endiliey.html')).toBe('/endiliey');
    expect(utils.removeExtension('/a.b/')).toBe('/a.b/');
    expect(utils.removeExtension('/a.b/c.png')).toBe('/a.b/c');
    expect(utils.removeExtension('/a.b/c.d.e')).toBe('/a.b/c.d');
    expect(utils.removeExtension('/docs/test')).toBe('/docs/test');
    expect(utils.removeExtension('pages.js')).toBe('pages');
  });
});
