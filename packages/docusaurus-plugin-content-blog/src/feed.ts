/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Feed, type Author as FeedAuthor, type Item as FeedItem} from 'feed';
import type {BlogPost} from './types';
import {
  normalizeUrl,
  posixPath,
  mapAsyncSequential,
  readOutputHTMLFile,
} from '@docusaurus/utils';
import cheerio from 'cheerio';
import type {DocusaurusConfig} from '@docusaurus/types';
import path from 'path';
import fs from 'fs-extra';
import type {
  FeedType,
  PluginOptions,
  Author,
} from '@docusaurus/plugin-content-blog';
import {blogPostContainerID} from '@docusaurus/utils-common';

async function generateBlogFeed({
  blogPosts,
  options,
  siteConfig,
  outDir,
}: {
  blogPosts: BlogPost[];
  options: PluginOptions;
  siteConfig: DocusaurusConfig;
  outDir: string;
}): Promise<Feed | null> {
  if (!blogPosts.length) {
    return null;
  }

  const {feedOptions, routeBasePath} = options;
  const {url: siteUrl, baseUrl, title, favicon} = siteConfig;
  const blogBaseUrl = normalizeUrl([siteUrl, baseUrl, routeBasePath]);

  const updated = blogPosts[0] && blogPosts[0].metadata.date;

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
    return {name: author.name, link: author.url, email: author.email};
  }

  await mapAsyncSequential(blogPosts, async (post) => {
    const {
      id,
      metadata: {
        title: metadataTitle,
        permalink,
        date,
        description,
        authors,
        tags,
      },
    } = post;

    const content = await readOutputHTMLFile(
      permalink.replace(siteConfig.baseUrl, ''),
      outDir,
      siteConfig.trailingSlash,
    );
    const $ = cheerio.load(content);

    const feedItem: FeedItem = {
      title: metadataTitle,
      id,
      link: normalizeUrl([siteUrl, permalink]),
      date,
      description,
      // Atom feed demands the "term", while other feeds use "name"
      category: tags.map((tag) => ({name: tag.label, term: tag.label})),
      content: $(`#${blogPostContainerID}`).html()!,
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
    await fs.outputFile(
      posixPath(path.join(generatePath, feedPath)),
      feedContent,
    );
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
  const feed = await generateBlogFeed({
    blogPosts,
    options,
    siteConfig,
    outDir,
  });

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
