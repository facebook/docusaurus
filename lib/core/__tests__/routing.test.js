/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {
  blogRouting,
  docsRouting,
  feedRouting,
  pageRouting,
  sitemapRouting,
} = require('../routing');

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

describe('Feed routing', () => {
  const feedRegex = feedRouting('/');
  const feedRegex2 = feedRouting('/reason/');

  test('valid feed url', () => {
    expect('/blog/atom.xml').toMatch(feedRegex);
    expect('/blog/feed.xml').toMatch(feedRegex);
    expect('/reason/blog/atom.xml').toMatch(feedRegex2);
    expect('/reason/blog/feed.xml').toMatch(feedRegex2);
  });

  test('invalid feed url', () => {
    expect('/blog/blog/feed.xml').not.toMatch(feedRegex);
    expect('/blog/test.xml').not.toMatch(feedRegex);
    expect('/reason/blog/atom.xml').not.toMatch(feedRegex);
    expect('/reason/blog/feed.xml').not.toMatch(feedRegex);
    expect('/blog/atom.xml').not.toMatch(feedRegex2);
    expect('/blog/feed.xml').not.toMatch(feedRegex2);
    expect('/reason/blog/test.xml').not.toMatch(feedRegex2);
    expect('/reason/blog/blog/feed.xml').not.toMatch(feedRegex2);
    expect('/reason/blog/blog/atom.xml').not.toMatch(feedRegex2);
  });

  test('not a feed', () => {
    expect('/blog/atom').not.toMatch(feedRegex);
    expect('/reason/blog/feed').not.toMatch(feedRegex2);
  });
});

describe('Page routing', () => {
  const pageRegex = pageRouting('/');
  const pageRegex2 = pageRouting('/reason/');

  test('valid page url', () => {
    expect('/index.html').toMatch(pageRegex);
    expect('/reason/index.html').toMatch(pageRegex2);
  });

  test('docs not considered as page', () => {
    expect('/docs/en/test.html').not.toMatch(pageRegex);
    expect('/reason/docs/en/test.html').not.toMatch(pageRegex2);
  });

  test('blog not considered as page', () => {
    expect('/blog/index.html').not.toMatch(pageRegex);
    expect('/reason/blog/index.html').not.toMatch(pageRegex2);
  });

  test('not a page', () => {
    expect('/yangshun.jpg').not.toMatch(pageRegex);
    expect('/reason/endilie.png').not.toMatch(pageRegex2);
  });


});

describe('Sitemap routing', () => {
  const sitemapRegex = sitemapRouting('/');
  const sitemapRegex2 = sitemapRouting('/reason/');

  test('valid sitemap url', () => {
    expect('/sitemap.xml').toMatch(sitemapRegex);
    expect('/reason/sitemap.xml').toMatch(sitemapRegex2);
  });

  test('invalid sitemap url', () => {
    expect('/reason/sitemap.xml').not.toMatch(sitemapRegex);
    expect('/sitemap/sitemap.xml').not.toMatch(sitemapRegex);
    expect('/reason/sitemap/sitemap.xml').not.toMatch(sitemapRegex);
    expect('/sitemap.xml').not.toMatch(sitemapRegex2);
  });

  test('not a sitemap', () => {
    expect('/sitemap').not.toMatch(sitemapRegex);
    expect('/reason/sitemap').not.toMatch(sitemapRegex2);
  });
});
