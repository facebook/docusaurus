/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const path = require('path');
const siteConfig = require(CWD + '/siteConfig.js');
const React = require('react');
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
const readMetadata = require('../readMetadata.js');
const BlogPostLayout = require('../../core/BlogPostLayout.js');
const BlogPageLayout = require('../../core/BlogPageLayout.js');

// Local constants
const MetadataBlog = require('../../core/MetadataBlog.js')
  .sort()
  .reverse();
const perPage = 10;

const blogHref = filePath => {
  // Converts it into the correct folder structure to match the date.
  // Example 2017/12/31-new-years.html
  return path
    .basename(filePath)
    .replace('-', '/')
    .replace('-', '/')
    .replace('-', '/')
    .replace(/\.md$/, '.html');
};

const renderBlogPostList = page => {
  // This does not seem to actually load anything. That is fine?
  const metadata = {page: page, perPage: perPage};
  const blogPageComp = (
    <BlogPageLayout
      metadata={metadata}
      language={undefined}
      config={siteConfig}
    />
  );
  return renderToStaticMarkup(blogPageComp);
};

const renderBlogPost = file => {
  const result = readMetadata.extractMetadata(
    fs.readFileSync(file, {encoding: 'utf8'})
  );
  const rawContent = result.rawContent;
  const metadata = Object.assign(
    {
      path: blogHref(file),
      content: rawContent,
    },
    result.metadata
  );
  metadata.id = metadata.title;

  const blogPostComp = (
    <BlogPostLayout
      metadata={metadata}
      language={undefined}
      config={siteConfig}>
      {rawContent}
    </BlogPostLayout>
  );

  return renderToStaticMarkup(blogPostComp);
};

module.exports = {
  renderBlogPostList,
  renderBlogPost,
  blogHref,
};
