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
 * @param feedDetails array containing blog feed content and name of file
 * @param generatePath path where the file would be copied in website
 */
async function addXmlStyleSheet({
  feedDetails,
  generatePath,
  xslPath,
  contentPaths,
}: {
  feedDetails: string[];
  generatePath: string;
  xslPath: string;
  contentPaths: BlogContentPaths;
}) {
  if (!feedDetails[0]) {
    return feedDetails;
  }

  const {contentPath} = contentPaths;
  const fileName = path.parse(xslPath).name;
  const isDefault = xslPath === 'rss.xslt' || xslPath === 'atom.xslt';
  const directoryPath = isDefault
    ? path.join(__dirname, '../assets/')
    : contentPath;
  const xsltLink = `<?xml version="1.0" encoding="utf-8"?><?xml-stylesheet type="text/xsl" href="${xslPath}"?>`;

  feedDetails[0] = feedDetails[0]?.replace(
    '<?xml version="1.0" encoding="utf-8"?>',
    xsltLink,
  );

  const xsltPath = path.join(directoryPath, `${fileName}.xslt`);
  const cssPath = path.join(directoryPath, `${fileName}.css`);
  const xsltGeneratePath = path.join(generatePath, `${fileName}.xslt`);
  const cssGeneratePath = path.join(generatePath, `${fileName}.css`);

  // output xslt file to website
  const xsltContent = await fs.readFile(xsltPath, 'utf8');
  await fs.outputFile(xsltGeneratePath, xsltContent, 'utf-8');

  // output stylesheet to website
  const stylesheetContent = await fs.readFile(cssPath, 'utf8');
  await fs.outputFile(cssGeneratePath, stylesheetContent, 'utf-8');

  return feedDetails;
}

async function createBlogFeedFile({
  feed,
  feedType,
  generatePath,
  feedOptions: {atomXslt, rssXslt, xslt},
  contentPaths,
}: {
  feed: Feed;
  feedType: FeedType;
  generatePath: string;
  feedOptions: FeedOptions;
  contentPaths: BlogContentPaths;
}) {
  let feedDetails = (() => {
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
    if (xslt) {
      feedDetails = await addXmlStyleSheet({
        feedDetails,
        generatePath,
        xslPath: feedDetails[1] === 'atom.xml' ? atomXslt : rssXslt,
        contentPaths,
      });
    }

    await fs.outputFile(
      path.join(generatePath, `${feedDetails[1]}`),
      feedDetails[0],
    );
  } catch (err) {
    throw new Error(`Error creating feed file: ${feedType}`, {cause: err});
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
