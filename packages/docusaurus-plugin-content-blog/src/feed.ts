/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {Feed, type Author as FeedAuthor} from 'feed';
import * as srcset from 'srcset';
import {normalizeUrl, readOutputHTMLFile} from '@docusaurus/utils';
import {
  blogPostContainerID,
  applyTrailingSlash,
} from '@docusaurus/utils-common';
import {load as cheerioLoad} from 'cheerio';
import type {BlogContentPaths} from './types';
import type {DocusaurusConfig, HtmlTags, LoadContext} from '@docusaurus/types';
import type {
  FeedType,
  PluginOptions,
  Author,
  BlogPost,
  BlogFeedItem,
  FeedOptions,
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

/**
 * @description addXmlStyleSheet appends a xsl stylesheet to the generated xml feed
 * @param feedDetails the feed content
 * @param generatePath path where the file would be copied in website
 * @param xsltFile path to the xslt file
 * @param contentPaths path to the content directory
 */
async function transformFeedWithStylesheet({
  feedDetails,
  generatePath,
  xsltFile,
  contentPaths: {contentPath},
}: {
  feedDetails: string;
  generatePath: string;
  xsltFile: string;
  contentPaths: BlogContentPaths;
}) {
  // TODO idk why there is this check
  if (!feedDetails) {
    return feedDetails;
  }

  const fileName = path.parse(xsltFile).name;
  const isDefault = false; // xsltFile === 'rss.xslt' || xsltFile === 'atom.xslt';
  const directoryPath = isDefault
    ? path.join(__dirname, '../assets/')
    : contentPath;

  const xsltLink = `<?xml version="1.0" encoding="utf-8"?><?xml-stylesheet type="text/xsl" href="${xsltFile}"?>`;
  const transformedFeed = feedDetails.replace(
    '<?xml version="1.0" encoding="utf-8"?>',
    xsltLink,
  );

  const xsltPath = path.join(directoryPath, `${fileName}.xslt`);
  const xsltContent = await fs.readFile(xsltPath, 'utf8');
  const xsltGeneratePath = path.join(generatePath, `${fileName}.xslt`);
  await fs.outputFile(xsltGeneratePath, xsltContent, 'utf-8');

  const cssPath = path.join(directoryPath, `${fileName}.css`);
  const stylesheetContent = await fs.readFile(cssPath, 'utf8');
  const cssGeneratePath = path.join(generatePath, `${fileName}.css`);
  await fs.outputFile(cssGeneratePath, stylesheetContent, 'utf-8');

  return transformedFeed;
}

async function createBlogFeedFile({
  feed,
  feedType,
  generatePath,
  feedOptions: {xslt},
  contentPaths,
}: {
  feed: Feed;
  feedType: FeedType;
  generatePath: string;
  feedOptions: FeedOptions;
  contentPaths: BlogContentPaths;
}) {
  const [feedContent, feedPath] = await (async () => {
    switch (feedType) {
      case 'rss': {
        const rssFeed = feed.rss2();
        const outputPath = 'rss.xml';
        if (xslt.rss) {
          const xsltFeed = await transformFeedWithStylesheet({
            feedDetails: rssFeed,
            generatePath,
            xsltFile: xslt.rss,
            contentPaths,
          });
          return [xsltFeed, outputPath];
        }
        return [rssFeed, outputPath];
      }
      case 'json':
        return [feed.json1(), 'feed.json'];
      case 'atom': {
        const atomFeed = feed.atom1();
        const outputPath = 'atom.xml';
        if (xslt.atom) {
          const xsltFeed = await transformFeedWithStylesheet({
            feedDetails: atomFeed,
            generatePath,
            xsltFile: xslt.atom,
            contentPaths,
          });
          return [xsltFeed, outputPath];
        }
        return [atomFeed, outputPath];
      }
      default:
        throw new Error(`Feed type ${feedType} not supported.`);
    }
  })();

  try {
    await fs.outputFile(path.join(generatePath, feedPath), feedContent);
  } catch (err) {
    throw new Error(`Generating ${feedType} feed failed.`, {
      cause: err as Error,
    });
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
  contentPaths,
}: {
  blogPosts: BlogPost[];
  options: PluginOptions;
  siteConfig: DocusaurusConfig;
  outDir: string;
  locale: string;
  contentPaths: BlogContentPaths;
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
        feedOptions: options.feedOptions,
        contentPaths,
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
