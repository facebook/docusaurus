/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import logger from '@docusaurus/logger';
import {Feed, type Author as FeedAuthor} from 'feed';
import * as srcset from 'srcset';
import {normalizeUrl, readOutputHTMLFile} from '@docusaurus/utils';
import {
  blogPostContainerID,
  applyTrailingSlash,
} from '@docusaurus/utils-common';
import {load as cheerioLoad} from 'cheerio';
import type {DocusaurusConfig, HtmlTags, LoadContext} from '@docusaurus/types';
import type {
  FeedType,
  PluginOptions,
  Author,
  BlogPost,
  BlogFeedItem,
} from '@docusaurus/plugin-content-blog';

async function generateBlogFeed({
  blogPosts,
  options,
  siteConfig,
  outDir,
  locale,
}: {
  blogPosts: BlogPost[];
  options: PluginOptions;
  siteConfig: DocusaurusConfig;
  outDir: string;
  locale: string;
}): Promise<Feed | null> {
  if (!blogPosts.length) {
    return null;
  }

  const {feedOptions, routeBasePath} = options;
  const {url: siteUrl, baseUrl, title, favicon, trailingSlash} = siteConfig;
  const blogBaseUrl = applyTrailingSlash(
    normalizeUrl([siteUrl, baseUrl, routeBasePath]),
    {
      trailingSlash,
      baseUrl,
    },
  );

  const blogPostsForFeed =
    feedOptions.limit === false || feedOptions.limit === null
      ? blogPosts
      : blogPosts.slice(0, feedOptions.limit);

  const updated = blogPostsForFeed[0]?.metadata.date;

  const feed = new Feed({
    id: blogBaseUrl,
    title: feedOptions.title ?? `${title} Blog`,
    updated,
    language: feedOptions.language ?? locale,
    link: blogBaseUrl,
    description: feedOptions.description ?? `${siteConfig.title} Blog`,
    favicon: favicon ? normalizeUrl([siteUrl, baseUrl, favicon]) : undefined,
    copyright: feedOptions.copyright,
  });

  const createFeedItems =
    options.feedOptions.createFeedItems ?? defaultCreateFeedItems;

  const feedItems = await createFeedItems({
    blogPosts: blogPostsForFeed,
    siteConfig,
    outDir,
    defaultCreateFeedItems,
  });

  feedItems.forEach(feed.addItem);

  return feed;
}

async function defaultCreateFeedItems({
  blogPosts,
  siteConfig,
  outDir,
}: {
  blogPosts: BlogPost[];
  siteConfig: DocusaurusConfig;
  outDir: string;
}): Promise<BlogFeedItem[]> {
  const {url: siteUrl, baseUrl, trailingSlash} = siteConfig;

  function toFeedAuthor(author: Author): FeedAuthor {
    return {name: author.name, link: author.url, email: author.email};
  }

  return Promise.all(
    blogPosts.map(async (post) => {
      const {
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
        permalink.replace(baseUrl, ''),
        outDir,
        trailingSlash,
      );
      const $ = cheerioLoad(content);

      const blogPostAbsoluteUrl = applyTrailingSlash(
        normalizeUrl([siteUrl, permalink]),
        {
          trailingSlash,
          baseUrl,
        },
      );

      const toAbsoluteUrl = (src: string) =>
        String(new URL(src, blogPostAbsoluteUrl));

      // Make links and image urls absolute
      // See https://github.com/facebook/docusaurus/issues/9136
      $(`div#${blogPostContainerID} a, div#${blogPostContainerID} img`).each(
        (_, elm) => {
          if (elm.tagName === 'a') {
            const {href} = elm.attribs;
            if (href) {
              elm.attribs.href = toAbsoluteUrl(href);
            }
          } else if (elm.tagName === 'img') {
            const {src, srcset: srcsetAttr} = elm.attribs;
            if (src) {
              elm.attribs.src = toAbsoluteUrl(src);
            }
            if (srcsetAttr) {
              elm.attribs.srcset = srcset.stringify(
                srcset.parse(srcsetAttr).map((props) => ({
                  ...props,
                  url: toAbsoluteUrl(props.url),
                })),
              );
            }
          }
        },
      );

      const feedItem: BlogFeedItem = {
        title: metadataTitle,
        id: blogPostAbsoluteUrl,
        link: blogPostAbsoluteUrl,
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

      return feedItem;
    }),
  );
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
    logger.error(`Generating ${feedType} feed failed.`);
    throw err;
  }
}

function shouldBeInFeed(blogPost: BlogPost): boolean {
  const excluded =
    blogPost.metadata.frontMatter.draft ||
    blogPost.metadata.frontMatter.unlisted;
  return !excluded;
}

export async function createBlogFeedFiles({
  blogPosts: allBlogPosts,
  options,
  siteConfig,
  outDir,
  locale,
}: {
  blogPosts: BlogPost[];
  options: PluginOptions;
  siteConfig: DocusaurusConfig;
  outDir: string;
  locale: string;
}): Promise<void> {
  const blogPosts = allBlogPosts.filter(shouldBeInFeed);

  const feed = await generateBlogFeed({
    blogPosts,
    options,
    siteConfig,
    outDir,
    locale,
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

export function createFeedHtmlHeadTags({
  context,
  options,
}: {
  context: LoadContext;
  options: PluginOptions;
}): HtmlTags {
  const feedTypes = options.feedOptions.type;
  if (!feedTypes) {
    return [];
  }
  const feedTitle = options.feedOptions.title ?? context.siteConfig.title;
  const feedsConfig = {
    rss: {
      type: 'application/rss+xml',
      path: 'rss.xml',
      title: `${feedTitle} RSS Feed`,
    },
    atom: {
      type: 'application/atom+xml',
      path: 'atom.xml',
      title: `${feedTitle} Atom Feed`,
    },
    json: {
      type: 'application/json',
      path: 'feed.json',
      title: `${feedTitle} JSON Feed`,
    },
  };
  const headTags: HtmlTags = [];

  feedTypes.forEach((feedType) => {
    const {
      type,
      path: feedConfigPath,
      title: feedConfigTitle,
    } = feedsConfig[feedType];

    headTags.push({
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type,
        href: normalizeUrl([
          context.siteConfig.baseUrl,
          options.routeBasePath,
          feedConfigPath,
        ]),
        title: feedConfigTitle,
      },
    });
  });

  return headTags;
}
