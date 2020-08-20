/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import globby from 'globby';
import chalk from 'chalk';
import path from 'path';
import readingTime from 'reading-time';
import {Feed} from 'feed';
import {PluginOptions, BlogPost, DateLink} from './types';
import {
  parseMarkdownFile,
  normalizeUrl,
  aliasedSitePath,
  getEditUrl,
} from '@docusaurus/utils';
import {LoadContext} from '@docusaurus/types';

export function truncate(fileString: string, truncateMarker: RegExp): string {
  return fileString.split(truncateMarker, 1).shift()!;
}

// YYYY-MM-DD-{name}.mdx?
// Prefer named capture, but older Node versions do not support it.
const FILENAME_PATTERN = /^(\d{4}-\d{1,2}-\d{1,2})-?(.*?).mdx?$/;

function toUrl({date, link}: DateLink) {
  return `${date
    .toISOString()
    .substring(0, '2019-01-01'.length)
    .replace(/-/g, '/')}/${link}`;
}

export async function generateBlogFeed(
  context: LoadContext,
  options: PluginOptions,
): Promise<Feed | null> {
  if (!options.feedOptions) {
    throw new Error(
      'Invalid options - `feedOptions` is not expected to be null.',
    );
  }
  const {siteDir, siteConfig} = context;
  const contentPath = path.resolve(siteDir, options.path);
  const blogPosts = await generateBlogPosts(contentPath, context, options);
  if (blogPosts == null) {
    return null;
  }

  const {feedOptions, routeBasePath} = options;
  const {url: siteUrl, title, favicon} = siteConfig;
  const blogBaseUrl = normalizeUrl([siteUrl, routeBasePath]);

  const updated =
    (blogPosts[0] && blogPosts[0].metadata.date) ||
    new Date('2015-10-25T16:29:00.000-07:00');

  const feed = new Feed({
    id: blogBaseUrl,
    title: feedOptions.title || `${title} Blog`,
    updated,
    language: feedOptions.language,
    link: blogBaseUrl,
    description: feedOptions.description || `${siteConfig.title} Blog`,
    favicon: normalizeUrl([siteUrl, favicon]),
    copyright: feedOptions.copyright,
  });

  blogPosts.forEach((post) => {
    const {
      id,
      metadata: {title: metadataTitle, permalink, date, description},
    } = post;
    feed.addItem({
      title: metadataTitle,
      id,
      link: normalizeUrl([siteUrl, permalink]),
      date,
      description,
    });
  });

  return feed;
}

export async function generateBlogPosts(
  blogDir: string,
  {siteConfig, siteDir}: LoadContext,
  options: PluginOptions,
): Promise<BlogPost[]> {
  const {
    include,
    routeBasePath,
    truncateMarker,
    showReadingTime,
    editUrl,
  } = options;

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const {baseUrl = ''} = siteConfig;
  const blogFiles = await globby(include, {
    cwd: blogDir,
  });

  const blogPosts: BlogPost[] = [];

  await Promise.all(
    blogFiles.map(async (relativeSource: string) => {
      const source = path.join(blogDir, relativeSource);
      const aliasedSource = aliasedSitePath(source, siteDir);
      const refDir = path.parse(blogDir).dir;
      const relativePath = path.relative(refDir, source);
      const blogFileName = path.basename(relativeSource);

      const editBlogUrl = getEditUrl(relativePath, editUrl);

      const {frontMatter, content, excerpt} = await parseMarkdownFile(source);

      if (frontMatter.draft && process.env.NODE_ENV === 'production') {
        return;
      }

      if (frontMatter.id) {
        console.warn(
          chalk.yellow(
            `${blogFileName} - 'id' header option is deprecated. Please use 'slug' option instead.`,
          ),
        );
      }

      let date;
      // Extract date and title from filename.
      const match = blogFileName.match(FILENAME_PATTERN);
      let linkName = blogFileName.replace(/\.mdx?$/, '');

      if (match) {
        const [, dateString, name] = match;
        date = new Date(dateString);
        linkName = name;
      }

      // Prefer user-defined date.
      if (frontMatter.date) {
        date = new Date(frontMatter.date);
      }

      // Use file create time for blog.
      date = date || (await fs.stat(source)).birthtime;

      const slug =
        frontMatter.slug || (match ? toUrl({date, link: linkName}) : linkName);
      frontMatter.title = frontMatter.title || linkName;

      blogPosts.push({
        id: frontMatter.slug || frontMatter.title,
        metadata: {
          permalink: normalizeUrl([baseUrl, routeBasePath, slug]),
          editUrl: editBlogUrl,
          source: aliasedSource,
          description: frontMatter.description || excerpt,
          date,
          tags: frontMatter.tags,
          title: frontMatter.title,
          readingTime: showReadingTime
            ? readingTime(content).minutes
            : undefined,
          truncated: truncateMarker?.test(content) || false,
        },
      });
    }),
  );

  blogPosts.sort(
    (a, b) => b.metadata.date.getTime() - a.metadata.date.getTime(),
  );

  return blogPosts;
}

export function linkify(
  fileContent: string,
  siteDir: string,
  blogPath: string,
  blogPosts: BlogPost[],
): string {
  let fencedBlock = false;
  const lines = fileContent.split('\n').map((line) => {
    if (line.trim().startsWith('```')) {
      fencedBlock = !fencedBlock;
    }

    if (fencedBlock) {
      return line;
    }

    let modifiedLine = line;
    const mdRegex = /(?:(?:\]\()|(?:\]:\s?))(?!https)([^'")\]\s>]+\.mdx?)/g;
    let mdMatch = mdRegex.exec(modifiedLine);

    while (mdMatch !== null) {
      const mdLink = mdMatch[1];
      const aliasedPostSource = `@site/${path.relative(
        siteDir,
        path.resolve(blogPath, mdLink),
      )}`;
      let blogPostPermalink = null;

      blogPosts.forEach((blogPost) => {
        if (blogPost.metadata.source === aliasedPostSource) {
          blogPostPermalink = blogPost.metadata.permalink;
        }
      });

      if (blogPostPermalink) {
        modifiedLine = modifiedLine.replace(mdLink, blogPostPermalink);
      }

      mdMatch = mdRegex.exec(modifiedLine);
    }

    return modifiedLine;
  });

  return lines.join('\n');
}
