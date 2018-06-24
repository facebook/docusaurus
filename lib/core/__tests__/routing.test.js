/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {docsRouting, blogRouting} = require('../routing');

describe('Blog routing', () => {
  const blogRegex = blogRouting('/');
  const blogRegex2 = blogRouting('/react/');

  test('valid blog', () => {
    expect('/blog/test.html').toMatch(blogRegex);
    expect('/react/blog/test.html').toMatch(blogRegex2);
  });

  test('invalid blog', () => {
    expect('/react/blog/test.html').not.toMatch(blogRegex);
    expect('/blog/test.html').not.toMatch(blogRegex2);
  });

  test('assets not classified as blog', () => {
    expect('/blog/assets/any.png').not.toMatch(blogRegex);
    expect('/react/blog/assets/any.png').not.toMatch(blogRegex2);
  });

  test('docs not classified as blog', () => {
    expect('/docs/en/blog.html').not.toMatch(blogRegex);
    expect('/docs/en/blog/blog.html').not.toMatch(blogRegex);
    expect('/react/docs/en/blog.html').not.toMatch(blogRegex2);
    expect('/react/docs/en/blog/blog.html').not.toMatch(blogRegex2);
  });
});

describe('Docs routing', () => {
  const docsRegex = docsRouting('/');
  const docsRegex2 = docsRouting('/reason/');

  test('valid docs', () => {
    expect('/docs/en/test.html').toMatch(docsRegex);
    expect('/reason/docs/en/test.html').toMatch(docsRegex2);
  });

  test('invalid docs', () => {
    expect('/reason/docs/en/test.html').not.toMatch(docsRegex);
    expect('/docs/en/test.html').not.toMatch(docsRegex2);
  });

  test('assets not classified as docs', () => {
    expect('/docs/en/notvalid.png').not.toMatch(docsRegex);
    expect('/reason/docs/en/notvalid.png').not.toMatch(docsRegex2);
  });

  test('blog not classified as docs', () => {
    expect('/blog/docs.html').not.toMatch(docsRegex);
    expect('/blog/docs/docs.html').not.toMatch(docsRegex);
    expect('/reason/blog/docs.html').not.toMatch(docsRegex2);
    expect('/reason/blog/docs/docs.html').not.toMatch(docsRegex2);
  });
});
