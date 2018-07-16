/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const path = require('path');
const fs = require('fs-extra');
const {renderToStaticMarkupWithDoctype} = require('./renderUtils');
const metadataUtils = require('./metadataUtils');

function getPages(numOfBlog, config) {
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

function getPost(file, urlPath, config) {
  if (!fs.existsSync(file)) {
    return null;
  }
  const result = metadataUtils.extractMetadata(
    fs.readFileSync(file, {encoding: 'utf8'})
  );
  const rawContent = result.rawContent;
  const metadata = Object.assign(
    {path: urlPath, content: rawContent},
    result.metadata
  );
  metadata.id = metadata.title;

  const BlogPostLayout = require('../core/BlogPostLayout.js');
  const blogPostComp = (
    <BlogPostLayout metadata={metadata} language="en" config={config}>
      {rawContent}
    </BlogPostLayout>
  );
  return renderToStaticMarkupWithDoctype(blogPostComp);
}

function urlToFile(url) {
  return url
    .replace(/\/index.html$/, '.md')
    .replace(/\.html$/, '.md')
    .replace(new RegExp('/', 'g'), '-');
}

function fileToUrl(file) {
  return path
    .basename(file)
    .replace('-', '/')
    .replace('-', '/')
    .replace('-', '/')
    .replace(/\.md$/, '.html');
}

module.exports = {
  fileToUrl,
  getPages,
  getPost,
  urlToFile,
};
