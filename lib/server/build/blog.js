/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Imports
const CWD = process.cwd();
const path = require('path');
const join = path.join;
const siteConfig = require(CWD + '/siteConfig');
const { copyFile, writeData, readFile, checkFile } = require('./common');
const glob = require('glob');
const feed = require('../feed.js');
const readMetadata = require('../readMetadata.js');
const buildDir = join(CWD, 'build', siteConfig.projectName);
const render = require('../render')
const MetadataBlog = require('../../core/MetadataBlog.js');
const perPage = 10;

const writeFeed = () => {
  console.log("Creating RSS and Atom feeds...")

  // create rss files for all blog pages, if there are any blog files
  if (MetadataBlog.length > 0) {
    let targetFile = join(buildDir, 'blog', 'feed.xml');
    writeData(targetFile, feed());
    targetFile = join(buildDir, 'blog', 'atom.xml');
    writeData(targetFile, feed('atom'));
  }
}

const buildBlogPosts = () =>
{
  console.log("Creating individual blog entries...")

  let unsorted = glob.sync(join(CWD, 'blog', '**', '*.*'));

  // let sorted = unsorted.sort().reverse();

  unsorted.forEach(file => {
    const extension = path.extname(file);

    // We only render Markdown files
    if (extension !== '.md' && extension !== '.markdown') {
      return;
    }
    
    let href = render.blog.blogHref(file);
    let targetFile = join(buildDir, 'blog', href);
    let rawHtml = render.blog.renderBlogPost(file);
    writeData(targetFile, rawHtml);
  });
}

const buildBlogPostList = () =>
{
  console.log("Creating blog listing...")
  let nextPageExists = true;
  let page = 1;

  // A page may only have one or two posts on it, we have to round up.
  const numberOfPages = Math.ceil(MetadataBlog.length / perPage);

  // Create each page
  for (let page = 0; page < numberOfPages; page++) {
    // Should this return null if we ask for a page that is too far in the past?
    // This would mean that we don't need to know the number of pages in this function
    const rawHtml =  render.blog.renderBlogPostList(page);

    let targetFile = join(
      buildDir,
      'blog',
      page > 0 ? 'page' + (page + 1) : '',
      'index.html');

    writeData(targetFile, rawHtml);
    page++;
  }
}

const buildBlog = () => {
  readMetadata.generateMetadataBlog();

  buildBlogPosts();
  buildBlogPostList();
  writeFeed();
}

module.exports = buildBlog;
