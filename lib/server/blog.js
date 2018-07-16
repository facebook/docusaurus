/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {renderToStaticMarkupWithDoctype} = require('./renderUtils');

function getPages(length, config) {
  const BlogPageLayout = require('../core/BlogPageLayout.js');
  const blogPages = {};
  const perPage = 10;
  for (let page = 0; page < Math.ceil(length / perPage); page++) {
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

module.exports = {
  getPages,
};
