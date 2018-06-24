/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {docsRouting, blogRouting} = require('../routing');

describe('Routing', () => {
  const docsRegex = docsRouting('/');
  const docsRegex2 = docsRouting('/test/');
  const blogRegex = blogRouting('/');
  const blogRegex2 = blogRouting('/test/');
  test('valid docs', () => {
    expect(docsRegex.exec('/docs/en/test.html')).not.toBeNull();
    expect(docsRegex2.exec('/test/docs/en/test.html')).not.toBeNull();
  });
  test('invalid docs', () => {
    expect(docsRegex.exec('/test/docs/en/test.html')).toBeNull();
    expect(docsRegex2.exec('/docs/en/test.html')).toBeNull();
  });
  test('valid blog', () => {
    expect(blogRegex.exec('/blog/test.html')).not.toBeNull();
    expect(blogRegex2.exec('/test/blog/test.html')).not.toBeNull();
  });
  test('invalid blog', () => {
    expect(blogRegex.exec('/test/blog/test.html')).toBeNull();
    expect(blogRegex2.exec('/blog/test.html')).toBeNull();
  });
  test('png not classified as docs or blog', () => {
    expect(docsRegex.exec('/docs/en/notvalid.png')).toBeNull();
    expect(docsRegex2.exec('/test/docs/en/notvalid.png')).toBeNull();
  });
  test('docs not classified as blog', () => {
    expect(blogRegex.exec('/docs/en/blog.html')).toBeNull();
    expect(blogRegex.exec('/docs/en/blog/blog.html')).toBeNull();
    expect(blogRegex2.exec('/test/docs/en/blog.html')).toBeNull();
    expect(blogRegex2.exec('/test/docs/en/blog/blog.html')).toBeNull();
  });
  test('blog not classified as docs', () => {
    expect(docsRegex.exec('/blog/docs.html')).toBeNull();
    expect(docsRegex.exec('/blog/docs/docs.html')).toBeNull();
    expect(docsRegex2.exec('/test/blog/docs.html')).toBeNull();
    expect(docsRegex2.exec('/test/blog/docs/docs.html')).toBeNull();
  });
});
