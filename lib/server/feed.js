/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const Feed = require('feed');

const chalk = require('chalk');
const CWD = process.cwd();

const siteConfig = require(CWD + '/siteConfig.js');

const blogFolder = path.resolve('../blog/');
const blogRootURL = siteConfig.url + siteConfig.baseUrl + 'blog';
const siteImageURL =
  siteConfig.url + siteConfig.baseUrl + siteConfig.headerIcon;
const utils = require('../core/utils');

const renderMarkdown = require('../core/renderMarkdown.js');

/****************************************************************************/

let readMetadata;
let Metadata;

readMetadata = require('./readMetadata.js');
readMetadata.generateMetadataDocs();
Metadata = require('../core/metadata.js');

/****************************************************************************/

module.exports = function(type) {
  console.log('feed.js triggered...');

  type = type || 'rss';

  readMetadata.generateMetadataBlog();
  const MetadataBlog = require('../core/MetadataBlog.js');

  const feed = new Feed({
    title: siteConfig.title + ' Blog',
    description:
      'The best place to stay up-to-date with the latest ' +
      siteConfig.title +
      ' news and events.',
    id: blogRootURL,
    link: blogRootURL,
    image: siteImageURL,
    copyright: siteConfig.copyright,
    updated: new Date(MetadataBlog[0].date),
  });

  MetadataBlog.forEach(post => {
    const url = blogRootURL + '/' + post.path;
    const content = utils.blogPostHasTruncateMarker(post.content)
      ? utils.extractBlogPostBeforeTruncate(post.content)
      : utils.extractBlogPostSummary(post.content.trim());
    feed.addItem({
      title: post.title,
      link: url,
      author: [
        {
          name: post.author,
          link: post.authorURL,
        },
      ],
      date: new Date(post.date),
      description: renderMarkdown(content),
    });
  });

  return type === 'rss' ? feed.rss2() : feed.atom1();
};
