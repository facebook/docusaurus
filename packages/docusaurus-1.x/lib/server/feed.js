/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Feed = require('feed');
const truncateHtml = require('truncate-html');

const BLOG_POST_SUMMARY_LENGTH = 250;

const CWD = process.cwd();
const siteConfig = require(`${CWD}/siteConfig.js`);
const readMetadata = require('./readMetadata.js');

const blogRootURL = `${siteConfig.url + siteConfig.baseUrl}blog`;
const siteImageURL =
  siteConfig.url + siteConfig.baseUrl + siteConfig.headerIcon;
const utils = require('../core/utils');

const renderMarkdown = require('../core/renderMarkdown.js');

module.exports = function(type) {
  console.log('feed.js triggered...');

  type = type || 'rss';

  readMetadata.generateMetadataBlog(siteConfig);
  const MetadataBlog = require('../core/MetadataBlog.js');
  const MetadataPublicBlog = MetadataBlog.filter(item => !item.draft);

  const feed = new Feed({
    title: `${siteConfig.title} Blog`,
    description: `The best place to stay up-to-date with the latest ${
      siteConfig.title
    } news and events.`,
    id: blogRootURL,
    link: blogRootURL,
    image: siteImageURL,
    copyright: siteConfig.copyright,
    updated: new Date(MetadataPublicBlog[0].date),
  });

  MetadataPublicBlog.forEach(post => {
    const url = `${blogRootURL}/${post.path}`;
    const description = utils.blogPostHasTruncateMarker(post.content)
      ? renderMarkdown(utils.extractBlogPostBeforeTruncate(post.content))
      : truncateHtml(renderMarkdown(post.content), BLOG_POST_SUMMARY_LENGTH);

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
      description,
    });
  });

  return type === 'rss' ? feed.rss2() : feed.atom1();
};
