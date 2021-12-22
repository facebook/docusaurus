/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Feed, Author as FeedAuthor, Item as FeedItem} from 'feed';
import {PluginOptions, Author, BlogPost, FeedType} from './types';
import {normalizeUrl, mdxToHtml} from '@docusaurus/utils';
import {DocusaurusConfig} from '@docusaurus/types';
import path from 'path';
import fs from 'fs-extra';

// TODO this is temporary until we handle mdxToHtml better
// It's hard to convert reliably JSX/require calls  to an html feed content
// See https://github.com/facebook/docusaurus/issues/5664
function mdxToFeedContent(mdxContent: string): string | undefined {
  try {
    return mdxToHtml(mdxContent);
  } catch (e) {
    // TODO will we need a plugin option to configure how to handle such an error
    // Swallow the error on purpose for now, until we understand better the problem space
    return undefined;
  }
}

export async function generateBlogFeed({
  blogPosts,
  options,
  siteConfig,
}: {
  blogPosts: BlogPost[];
  options: PluginOptions;
  siteConfig: DocusaurusConfig;
}): Promise<Feed | null> {
  if (!blogPosts.length) {
    return null;
  }

  const {feedOptions, routeBasePath} = options;
  const {url: siteUrl, baseUrl, title, favicon} = siteConfig;
  const blogBaseUrl = normalizeUrl([siteUrl, baseUrl, routeBasePath]);

  const updated =
    (blogPosts[0] && blogPosts[0].metadata.date) ||
    new Date('2015-10-25T16:29:00.000-07:00'); // weird legacy magic date

  const feed = new Feed({
    id: blogBaseUrl,
    title: feedOptions.title || `${title} Blog`,
    updated,
    language: feedOptions.language,
    link: blogBaseUrl,
    description: feedOptions.description || `${siteConfig.title} Blog`,
    favicon: favicon ? normalizeUrl([siteUrl, baseUrl, favicon]) : undefined,
    copyright: feedOptions.copyright,
  });

  function toFeedAuthor(author: Author): FeedAuthor {
    // TODO ask author emails?
    // RSS feed requires email to render authors
    return {name: author.name, link: author.url};
  }

  blogPosts.forEach((post) => {
    const {
      id,
      metadata: {title: metadataTitle, permalink, date, description, authors},
    } = post;

    const feedItem: FeedItem = {
      title: metadataTitle,
      id,
      link: normalizeUrl([siteUrl, permalink]),
      date,
      description,
      content: mdxToFeedContent(post.content),
    };

    // json1() method takes the first item of authors array
    // it causes an error when authors array is empty
    const feedItemAuthors = authors.map(toFeedAuthor);
    if (feedItemAuthors.length > 0) {
      feedItem.author = feedItemAuthors;
    }

    feed.addItem(feedItem);
  });

  return feed;
}

async function createBlogFeedFile({
  feed,
  feedType,
  generatePath,
}: {
  feed: Feed;
  feedType: FeedType;
  generatePath: string;
}) {
  const [feedContent, feedPath] = (() => {
    switch (feedType) {
      case 'rss':
        return [feed.rss2(), 'rss.xml'];
      case 'json':
        return [feed.json1(), 'feed.json'];
      case 'atom':
        return [feed.atom1(), 'atom.xml'];
      default:
        throw new Error(`Feed type ${feedType} not supported.`);
    }
  })();
  try {
    await fs.outputFile(path.join(generatePath, feedPath), feedContent);
  } catch (err) {
    throw new Error(`Generating ${feedType} feed failed: ${err}.`);
  }
}

export async function createBlogFeedFiles({
  blogPosts,
  options,
  siteConfig,
  outDir,
}: {
  blogPosts: BlogPost[];
  options: PluginOptions;
  siteConfig: DocusaurusConfig;
  outDir: string;
}): Promise<void> {
  const feed = await generateBlogFeed({blogPosts, options, siteConfig});

  const feedTypes = options.feedOptions.type;
  if (!feed || !feedTypes) {
    return;
  }

  await Promise.all(
    feedTypes.map((feedType) =>
      createBlogFeedFile({
        feed,
        feedType,
        generatePath: path.join(outDir, options.routeBasePath),
      }),
    ),
  );
}
