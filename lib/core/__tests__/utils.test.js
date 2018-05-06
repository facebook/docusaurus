/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const utils = require('../utils');
const readFileSync = require('fs').readFileSync;

const blogPostWithTruncateContents = readFileSync(
  path.join(__dirname, '__fixtures__', 'blog-post-with-truncate.md'),
  'utf-8'
);

const blogPostWithoutTruncateContents = readFileSync(
  path.join(__dirname, '__fixtures__', 'blog-post-without-truncate.md'),
  'utf-8'
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

  test('extractBlogPostSummary', () => {
    expect(
      utils.extractBlogPostSummary(blogPostWithTruncateContents)
    ).toMatchSnapshot();
    expect(
      utils.extractBlogPostSummary(blogPostWithoutTruncateContents)
    ).toMatchSnapshot();
  });
});
