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
import {resolve} from 'url';
import readingTime from 'reading-time';
import {Feed} from 'feed';
import {keyBy} from 'lodash';
import {
  PluginOptions,
  BlogPost,
  DateLink,
  BlogContentPaths,
  BlogBrokenMarkdownLink,
  BlogMarkdownLoaderOptions,
} from './types';
import {
  parseMarkdownFile,
  normalizeUrl,
  aliasedSitePath,
  getEditUrl,
  getFolderContainingFile,
  posixPath,
  getDateTimeFormat,
} from '@docusaurus/utils';
import {LoadContext} from '@docusaurus/types';

export function truncate(fileString: string, truncateMarker: RegExp): string {
  return fileString.split(truncateMarker, 1).shift()!;
}

export function getPostsBySource(
  blogPosts: BlogPost[],
): Record<string, BlogPost> {
  return keyBy(blogPosts, (item) => item.metadata.source);
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
  contentPaths: BlogContentPaths,
  context: LoadContext,
  options: PluginOptions,
): Promise<Feed | null> {
  if (!options.feedOptions) {
    throw new Error(
      'Invalid options - `feedOptions` is not expected to be null.',
    );
  }
  const {siteConfig} = context;
  const blogPosts = await generateBlogPosts(contentPaths, context, options);
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
  contentPaths: BlogContentPaths,
  {siteConfig, siteDir, i18n}: LoadContext,
  options: PluginOptions,
): Promise<BlogPost[]> {
  const {
    include,
    routeBasePath,
    truncateMarker,
    showReadingTime,
    editUrl,
  } = options;

  if (!fs.existsSync(contentPaths.contentPath)) {
    return [];
  }

  const {baseUrl = ''} = siteConfig;
  const blogSourceFiles = await globby(include, {
    cwd: contentPaths.contentPath,
  });

  const blogPosts: BlogPost[] = [];

  await Promise.all(
    blogSourceFiles.map(async (blogSourceFile: string) => {
      // Lookup in localized folder in priority
      const blogDirPath = await getFolderContainingFile(
        getContentPathList(contentPaths),
        blogSourceFile,
      );

      const source = path.join(blogDirPath, blogSourceFile);

      const aliasedSource = aliasedSitePath(source, siteDir);

      const blogFileName = path.basename(blogSourceFile);

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
      const formattedDate = getDateTimeFormat(i18n.currentLocale)(
        i18n.currentLocale,
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        },
      ).format(date);

      const slug =
        frontMatter.slug || (match ? toUrl({date, link: linkName}) : linkName);
      frontMatter.title = frontMatter.title || linkName;

      const permalink = normalizeUrl([baseUrl, routeBasePath, slug]);

      function getBlogEditUrl() {
        const blogPathRelative = path.relative(
          blogDirPath,
          path.resolve(source),
        );

        if (typeof editUrl === 'function') {
          return editUrl({
            blogDirPath: posixPath(path.relative(siteDir, blogDirPath)),
            blogPath: posixPath(blogPathRelative),
            permalink,
            locale: i18n.currentLocale,
          });
        } else if (typeof editUrl === 'string') {
          const isLocalized = blogDirPath === contentPaths.contentPathLocalized;
          const fileContentPath =
            isLocalized && options.editLocalizedFiles
              ? contentPaths.contentPathLocalized
              : contentPaths.contentPath;

          const contentPathEditUrl = normalizeUrl([
            editUrl,
            posixPath(path.relative(siteDir, fileContentPath)),
          ]);

          return getEditUrl(blogPathRelative, contentPathEditUrl);
        } else {
          return undefined;
        }
      }

      blogPosts.push({
        id: frontMatter.slug || frontMatter.title,
        metadata: {
          permalink,
          editUrl: getBlogEditUrl(),
          source: aliasedSource,
          description: frontMatter.description || excerpt,
          date,
          formattedDate,
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

export type LinkifyParams = {
  filePath: string;
  fileContent: string;
} & Pick<
  BlogMarkdownLoaderOptions,
  'blogPostsBySource' | 'siteDir' | 'contentPaths' | 'onBrokenMarkdownLink'
>;

export function linkify({
  filePath,
  contentPaths,
  fileContent,
  siteDir,
  blogPostsBySource,
  onBrokenMarkdownLink,
}: LinkifyParams): string {
  // TODO temporary, should consider the file being in localized folder!
  const folderPath = contentPaths.contentPath;

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

      const aliasedSource = (source: string) =>
        aliasedSitePath(source, siteDir);

      const blogPost: BlogPost | undefined =
        blogPostsBySource[aliasedSource(resolve(filePath, mdLink))] ||
        blogPostsBySource[
          aliasedSource(`${contentPaths.contentPathLocalized}/${mdLink}`)
        ] ||
        blogPostsBySource[
          aliasedSource(`${contentPaths.contentPath}/${mdLink}`)
        ];

      if (blogPost) {
        modifiedLine = modifiedLine.replace(
          mdLink,
          blogPost.metadata.permalink,
        );
      } else {
        const brokenMarkdownLink: BlogBrokenMarkdownLink = {
          folderPath,
          filePath,
          link: mdLink,
        };
        onBrokenMarkdownLink(brokenMarkdownLink);
      }

      mdMatch = mdRegex.exec(modifiedLine);
    }

    return modifiedLine;
  });

  return lines.join('\n');
}

// Order matters: we look in priority in localized folder
export function getContentPathList(contentPaths: BlogContentPaths): string[] {
  return [contentPaths.contentPathLocalized, contentPaths.contentPath];
}
