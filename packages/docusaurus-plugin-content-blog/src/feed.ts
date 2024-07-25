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
import {blogPostContainerID} from '@docusaurus/utils-common';
import {load as cheerioLoad} from 'cheerio';
import type {BlogContentPaths} from './types';
import type {DocusaurusConfig} from '@docusaurus/types';
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
  const {url: siteUrl, baseUrl, title, favicon} = siteConfig;
  const blogBaseUrl = normalizeUrl([siteUrl, baseUrl, routeBasePath]);

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
  const {url: siteUrl} = siteConfig;

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
        permalink.replace(siteConfig.baseUrl, ''),
        outDir,
        siteConfig.trailingSlash,
      );
      const $ = cheerioLoad(content);

      const blogPostAbsoluteUrl = normalizeUrl([siteUrl, permalink]);

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
  console.log(xslPath);
  const isDefault = xslPath === 'rss.xslt' || xslPath === 'atom.xslt';
  console.log('isDefault:', isDefault);
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
  xslt,
  atomXslt,
  rssXslt,
  contentPaths,
}: {
  feed: Feed;
  feedType: FeedType;
  generatePath: string;
  xslt: boolean;
  atomXslt: string;
  rssXslt: string;
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
        xslt: options.feedOptions.xslt,
        atomXslt: options.feedOptions.atomXslt,
        rssXslt: options.feedOptions.rssXslt,
        contentPaths,
      }),
    ),
  );
}
