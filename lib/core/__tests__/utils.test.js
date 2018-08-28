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
    // does not change/transform path
    expect(utils.getPath('/en/users.html', false)).toBe('/en/users.html');
    expect(utils.getPath('/docs/en/versioning.html', false)).toBe(
      '/docs/en/versioning.html'
    );
    expect(utils.getPath(undefined, false)).toBeUndefined();
    expect(utils.getPath(null, false)).toBeNull();

    // transform to pretty/clean path
    const cleanPath = pathStr => utils.getPath(pathStr, true);
    expect(cleanPath('/en/users')).toBe('/en/users');
    expect(cleanPath('/docs/versioning.html')).toBe('/docs/versioning');
    expect(cleanPath('/en/users.html')).toBe('/en/users');
    expect(cleanPath('/docs/en/asd/index.html')).toBe('/docs/en/asd/');
    expect(cleanPath('/en/help/index.html')).toBe('/en/help/');
    expect(cleanPath('/index.html')).toBe('/');
    expect(cleanPath('/react/index.html')).toBe('/react/');
    expect(cleanPath('/en/help.a.b.c.d.e.html')).toBe('/en/help.a.b.c.d.e');
    expect(cleanPath('/en/help.js')).toBe('/en/help.js');
    expect(cleanPath('/test.md')).toBe('/test.md');
    expect(cleanPath('/blog/7.0.0')).toBe('/blog/7.0.0');
    expect(cleanPath('/test/5.html.2')).toBe('/test/5.html.2');
    expect(cleanPath('/docs/en/5.2')).toBe('/docs/en/5.2');
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
