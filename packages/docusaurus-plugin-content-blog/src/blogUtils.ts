/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import readingTime from 'reading-time';
import {Feed} from 'feed';
import {compact, keyBy, mapValues, pickBy, identity} from 'lodash';
import {
  Author,
  PluginOptions,
  BlogPost,
  BlogContentPaths,
  BlogMarkdownLoaderOptions,
  BlogTags,
} from './types';
import {
  parseMarkdownFile,
  normalizeUrl,
  aliasedSitePath,
  getEditUrl,
  getFolderContainingFile,
  posixPath,
  replaceMarkdownLinks,
  Globby,
  normalizeFrontMatterTags,
  groupTaggedItems,
} from '@docusaurus/utils';
import {Joi, URISchema} from '@docusaurus/utils-validation';
import {LoadContext} from '@docusaurus/types';
import {
  validateBlogPostFrontMatter,
  BlogPostFrontMatter,
} from './blogFrontMatter';
import Yaml from 'js-yaml';

export function truncate(fileString: string, truncateMarker: RegExp): string {
  return fileString.split(truncateMarker, 1).shift()!;
}

export function getSourceToPermalink(
  blogPosts: BlogPost[],
): Record<string, string> {
  return mapValues(
    keyBy(blogPosts, (item) => item.metadata.source),
    (v) => v.metadata.permalink,
  );
}

export function getBlogTags(blogPosts: BlogPost[]): BlogTags {
  const groups = groupTaggedItems(
    blogPosts,
    (blogPost) => blogPost.metadata.tags,
  );
  return mapValues(groups, (group) => {
    return {
      name: group.tag.label,
      items: group.items.map((item) => item.id),
      permalink: group.tag.permalink,
    };
  });
}

const DATE_FILENAME_REGEX = /^(?<date>\d{4}[-/]\d{1,2}[-/]\d{1,2})[-/]?(?<text>.*?)(\/index)?.mdx?$/;

type ParsedBlogFileName = {
  date: Date | undefined;
  text: string;
  slug: string;
};

export function parseBlogFileName(
  blogSourceRelative: string,
): ParsedBlogFileName {
  const dateFilenameMatch = blogSourceRelative.match(DATE_FILENAME_REGEX);
  if (dateFilenameMatch) {
    const dateString = dateFilenameMatch.groups!.date!;
    const text = dateFilenameMatch.groups!.text!;
    // Always treat dates as UTC by adding the `Z`
    const date = new Date(`${dateString}Z`);
    const slugDate = dateString.replace(/-/g, '/');
    const slug = `/${slugDate}/${text}`;
    return {date, text, slug};
  } else {
    const text = blogSourceRelative.replace(/(\/index)?\.mdx?$/, '');
    const slug = `/${text}`;
    return {date: undefined, text, slug};
  }
}

function formatBlogPostDate(locale: string, date: Date): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  } catch (e) {
    throw new Error(`Can't format blog post date "${date}"`);
  }
}

type AuthorMap = Record<string, Author>;

async function readAuthorMapFile(
  filePath: string,
): Promise<AuthorMap | undefined> {
  const AuthorMapSchema = Joi.object<AuthorMap>().pattern(
    Joi.string(),
    Joi.object({
      name: Joi.string(),
      url: URISchema,
      imageURL: URISchema,
      title: Joi.string(),
    }).rename('image_url', 'imageURL'),
  );

  function validateAuthorMapFile(content: unknown): AuthorMap {
    return Joi.attempt(content, AuthorMapSchema);
  }

  if (await fs.pathExists(filePath)) {
    const contentString = await fs.readFile(filePath, {encoding: 'utf8'});
    const parse =
      filePath.endsWith('.yml') || filePath.endsWith('.yaml')
        ? Yaml.load
        : JSON.parse;
    try {
      const unsafeContent = parse(contentString);
      return validateAuthorMapFile(unsafeContent);
    } catch (e) {
      console.error(chalk.red('The author list file looks invalid!'));
      throw e;
    }
  }
  return undefined;
}

async function getAuthorMap(contentPaths: BlogContentPaths, filePath: string) {
  async function getAuthorMapFilePath() {
    try {
      return await getFolderContainingFile(
        getContentPathList(contentPaths),
        filePath,
      );
    } catch {
      return undefined;
    }
  }
  const authorMapDir = await getAuthorMapFilePath();
  if (!authorMapDir) {
    return undefined;
  }
  return readAuthorMapFile(path.join(authorMapDir, filePath));
}

function normalizeAuthor(
  frontMatter: BlogPostFrontMatter,
): Pick<BlogPostFrontMatter, 'author_keys' | 'authors'> {
  /* eslint-disable camelcase */
  const {
    author,
    authors,
    author_key,
    author_keys,
    author_title,
    author_url,
    author_image_url,
    authorTitle,
    authorURL,
    authorImageURL,
  } = frontMatter;
  if (
    typeof author === 'string' ||
    (typeof author === 'undefined' &&
      (author_title ||
        author_url ||
        author_image_url ||
        authorTitle ||
        authorURL ||
        authorImageURL ||
        author_key))
  ) {
    return {
      author_keys: author_key ? [author_key] : undefined,
      authors: [
        {
          name: author,
          title: author_title || authorTitle,
          url: author_url || authorURL,
          imageURL: author_image_url || authorImageURL,
        },
      ],
    };
  }
  if (author) {
    return {
      author_keys: author_key ? [author_key] : undefined,
      authors: [author],
    };
  }
  return {
    author_keys,
    authors: authors || [],
  };
  /* eslint-enable camelcase */
}

export async function generateBlogFeed(
  contentPaths: BlogContentPaths,
  context: LoadContext,
  options: PluginOptions,
): Promise<Feed | null> {
  if (!options.feedOptions) {
    throw new Error(
      'Invalid options: "feedOptions" is not expected to be null.',
    );
  }
  const {siteConfig} = context;
  const blogPosts = await generateBlogPosts(contentPaths, context, options);
  if (!blogPosts.length) {
    return null;
  }

  const {feedOptions, routeBasePath} = options;
  const {url: siteUrl, baseUrl, title, favicon} = siteConfig;
  const blogBaseUrl = normalizeUrl([siteUrl, baseUrl, routeBasePath]);

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
    favicon: favicon ? normalizeUrl([siteUrl, baseUrl, favicon]) : undefined,
    copyright: feedOptions.copyright,
  });

  blogPosts.forEach((post) => {
    const {
      id,
      metadata: {title: metadataTitle, permalink, date, description, authors},
    } = post;
    feed.addItem({
      title: metadataTitle,
      id,
      link: normalizeUrl([siteUrl, permalink]),
      date,
      description,
      ...(authors
        ? {
            author: authors.map((author) => {
              return {name: author.name, link: author.url};
            }),
          }
        : undefined),
    });
  });

  return feed;
}

async function parseBlogPostMarkdownFile(blogSourceAbsolute: string) {
  const result = await parseMarkdownFile(blogSourceAbsolute, {
    removeContentTitle: true,
  });
  return {
    ...result,
    frontMatter: validateBlogPostFrontMatter(result.frontMatter),
  };
}

async function processBlogSourceFile(
  blogSourceRelative: string,
  contentPaths: BlogContentPaths,
  context: LoadContext,
  options: PluginOptions,
  authorMap?: AuthorMap,
): Promise<BlogPost | undefined> {
  const {
    siteConfig: {baseUrl},
    siteDir,
    i18n,
  } = context;
  const {routeBasePath, truncateMarker, showReadingTime, editUrl} = options;

  // Lookup in localized folder in priority
  const blogDirPath = await getFolderContainingFile(
    getContentPathList(contentPaths),
    blogSourceRelative,
  );

  const blogSourceAbsolute = path.join(blogDirPath, blogSourceRelative);

  const {
    frontMatter,
    content,
    contentTitle,
    excerpt,
  } = await parseBlogPostMarkdownFile(blogSourceAbsolute);

  const aliasedSource = aliasedSitePath(blogSourceAbsolute, siteDir);

  if (frontMatter.draft && process.env.NODE_ENV === 'production') {
    return undefined;
  }

  if (frontMatter.id) {
    console.warn(
      chalk.yellow(
        `"id" header option is deprecated in ${blogSourceRelative} file. Please use "slug" option instead.`,
      ),
    );
  }

  const parsedBlogFileName = parseBlogFileName(blogSourceRelative);

  async function getDate(): Promise<Date> {
    // Prefer user-defined date.
    if (frontMatter.date) {
      return new Date(frontMatter.date);
    } else if (parsedBlogFileName.date) {
      return parsedBlogFileName.date;
    }
    // Fallback to file create time
    return (await fs.stat(blogSourceAbsolute)).birthtime;
  }

  const date = await getDate();
  const formattedDate = formatBlogPostDate(i18n.currentLocale, date);

  const title = frontMatter.title ?? contentTitle ?? parsedBlogFileName.text;
  const description = frontMatter.description ?? excerpt ?? '';

  const slug = frontMatter.slug || parsedBlogFileName.slug;

  const permalink = normalizeUrl([baseUrl, routeBasePath, slug]);

  function getBlogEditUrl() {
    const blogPathRelative = path.relative(
      blogDirPath,
      path.resolve(blogSourceAbsolute),
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
    }
    return undefined;
  }

  const tagsBasePath = normalizeUrl([baseUrl, options.routeBasePath, 'tags']);
  const {
    author_keys: authorKeys,
    authors: frontMatterAuthors,
  } = normalizeAuthor(frontMatter);
  let authors: Author[] = [];
  if (authorKeys) {
    if (!authorMap) {
      throw Error(
        `The "author_key" front matter is used but no author list file is found at path ${options.authorMapPath}.`,
      );
    }
    authors = authorKeys.map((key) => {
      if (!authorMap[key]) {
        throw Error(`Author with key "${key}" not found in the list file. Available keys are:
${Object.keys(authorMap)
  .map((validKey) => `- ${validKey}`)
  .join('\n')}`);
      }
      return authorMap[key];
    });
  }
  if (frontMatterAuthors) {
    authors = frontMatterAuthors.map((author, index) => {
      if (index < authors.length) {
        return {
          ...pickBy(authors[index], identity()),
          ...pickBy(author, identity()),
        };
      }
      return author;
    });
  }

  return {
    id: frontMatter.slug ?? title,
    metadata: {
      permalink,
      editUrl: getBlogEditUrl(),
      source: aliasedSource,
      title,
      description,
      date,
      formattedDate,
      tags: normalizeFrontMatterTags(tagsBasePath, frontMatter.tags),
      readingTime: showReadingTime ? readingTime(content).minutes : undefined,
      truncated: truncateMarker?.test(content) || false,
      authors,
    },
  };
}

export async function generateBlogPosts(
  contentPaths: BlogContentPaths,
  context: LoadContext,
  options: PluginOptions,
): Promise<BlogPost[]> {
  const {include, exclude} = options;

  if (!fs.existsSync(contentPaths.contentPath)) {
    return [];
  }

  const blogSourceFiles = await Globby(include, {
    cwd: contentPaths.contentPath,
    ignore: exclude,
  });

  const authorMap = await getAuthorMap(contentPaths, options.authorMapPath);

  const blogPosts: BlogPost[] = compact(
    await Promise.all(
      blogSourceFiles.map(async (blogSourceFile: string) => {
        try {
          return await processBlogSourceFile(
            blogSourceFile,
            contentPaths,
            context,
            options,
            authorMap,
          );
        } catch (e) {
          console.error(
            chalk.red(
              `Processing of blog source file failed for path "${blogSourceFile}"`,
            ),
          );
          throw e;
        }
      }),
    ),
  );

  blogPosts.sort(
    (a, b) => b.metadata.date.getTime() - a.metadata.date.getTime(),
  );

  return blogPosts;
}

export type LinkifyParams = {
  filePath: string;
  fileString: string;
} & Pick<
  BlogMarkdownLoaderOptions,
  'sourceToPermalink' | 'siteDir' | 'contentPaths' | 'onBrokenMarkdownLink'
>;

export function linkify({
  filePath,
  contentPaths,
  fileString,
  siteDir,
  sourceToPermalink,
  onBrokenMarkdownLink,
}: LinkifyParams): string {
  const {newContent, brokenMarkdownLinks} = replaceMarkdownLinks({
    siteDir,
    fileString,
    filePath,
    contentPaths,
    sourceToPermalink,
  });

  brokenMarkdownLinks.forEach((l) => onBrokenMarkdownLink(l));

  return newContent;
}

// Order matters: we look in priority in localized folder
export function getContentPathList(contentPaths: BlogContentPaths): string[] {
  return [contentPaths.contentPathLocalized, contentPaths.contentPath];
}
