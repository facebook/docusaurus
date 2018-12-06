/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const path = require('path');
const fs = require('fs-extra');
const metadataUtils = require('./metadataUtils');
const {replaceAssetsLink} = require('./utils.js');
const {renderToStaticMarkupWithDoctype} = require('./renderUtils');

function urlToSource(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }
  return url
    .replace(/\/index.html$/, '.md')
    .replace(/\.html$/, '.md')
    .replace(new RegExp('/', 'g'), '-');
}

function fileToUrl(file) {
  if (!file || !fs.existsSync(file) || typeof file !== 'string') {
    return null;
  }
  return path
    .basename(file)
    .replace('-', '/')
    .replace('-', '/')
    .replace('-', '/')
    .replace(/\.md$/, '.html');
}

function getPagesMarkup(numOfBlog, config) {
  const BlogPageLayout = require('../core/BlogPageLayout.js');
  const blogPages = {};
  const perPage = 10;
  for (let page = 0; page < Math.ceil(numOfBlog / perPage); page++) {
    const metadata = {page, perPage};
    const blogPageComp = (
      <BlogPageLayout metadata={metadata} language="en" config={config} />
    );
    const str = renderToStaticMarkupWithDoctype(blogPageComp);
    const pagePath = `${page > 0 ? `page${page + 1}` : ''}/index.html`;
    blogPages[pagePath] = str;
  }
  return blogPages;
}

function getMetadata(file) {
  if (!file || !fs.existsSync(file)) {
    return null;
  }
  const result = metadataUtils.extractMetadata(
    fs.readFileSync(file, {encoding: 'utf8'}),
  );
  const metadata = Object.assign(
    {
      path: fileToUrl(file),
      content: replaceAssetsLink(result.rawContent, 'blog'),
    },
    result.metadata,
  );
  metadata.id = metadata.title;
  return metadata;
}

function getPostMarkup(file, config) {
  const metadata = getMetadata(file);
  if (!metadata) {
    return null;
  }
  const BlogPostLayout = require('../core/BlogPostLayout.js');
  const blogPostComp = (
    <BlogPostLayout metadata={metadata} language="en" config={config}>
      {metadata.content}
    </BlogPostLayout>
  );
  return renderToStaticMarkupWithDoctype(blogPostComp);
}

module.exports = {
  fileToUrl,
  getMetadata,
  getPagesMarkup,
  getPostMarkup,
  urlToSource,
};
