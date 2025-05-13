/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import logger from '@docusaurus/logger';
import {
  parseMarkdownFile,
  normalizeUrl,
  aliasedSitePath,
  getEditUrl,
  getFolderContainingFile,
  posixPath,
  Globby,
  groupTaggedItems,
  getTagVisibility,
  getFileCommitDate,
  getContentPathList,
  isUnlisted,
  isDraft,
  readLastUpdateData,
  normalizeTags,
  aliasedSitePathToRelativePath,
} from '@docusaurus/utils';
import {getTagsFile} from '@docusaurus/utils-validation';
import {validateBlogPostFrontMatter} from './frontMatter';
import {getBlogPostAuthors} from './authors';
import {reportAuthorsProblems} from './authorsProblems';
import {calculateReadingTime} from './readingTime';
import type {TagsFile} from '@docusaurus/utils';
import type {LoadContext, ParseFrontMatter} from '@docusaurus/types';
import type {
  AuthorsMap,
  PluginOptions,
  ReadingTimeFunction,
  BlogPost,
  BlogTags,
  BlogPaginated,
} from '@docusaurus/plugin-content-blog';
import type {BlogContentPaths} from './types';

export function truncate(fileString: string, truncateMarker: RegExp): string {
  return fileString.split(truncateMarker, 1).shift()!;
}

export function reportUntruncatedBlogPosts({
  blogPosts,
  onUntruncatedBlogPosts,
}: {
  blogPosts: BlogPost[];
  onUntruncatedBlogPosts: PluginOptions['onUntruncatedBlogPosts'];
}): void {
  const untruncatedBlogPosts = blogPosts.filter(
    (p) => !p.metadata.hasTruncateMarker,
  );
  if (onUntruncatedBlogPosts !== 'ignore' && untruncatedBlogPosts.length > 0) {
    const message = logger.interpolate`Docusaurus found blog posts without truncation markers:
- ${untruncatedBlogPosts
      .map((p) => logger.path(aliasedSitePathToRelativePath(p.metadata.source)))
      .join('\n- ')}

We recommend using truncation markers (code=${`<!-- truncate -->`} or code=${`{/* truncate */}`}) in blog posts to create shorter previews on blog paginated lists.
Tip: turn this security off with the code=${`onUntruncatedBlogPosts: 'ignore'`} blog plugin option.`;
    logger.report(onUntruncatedBlogPosts)(message);
  }
}

export function paginateBlogPosts({
  blogPosts,
  basePageUrl,
  blogTitle,
  blogDescription,
  postsPerPageOption,
  pageBasePath,
}: {
  blogPosts: BlogPost[];
  basePageUrl: string;
  blogTitle: string;
  blogDescription: string;
  postsPerPageOption: number | 'ALL';
  pageBasePath: string;
}): BlogPaginated[] {
  const totalCount = blogPosts.length;
  const postsPerPage =
    postsPerPageOption === 'ALL' ? totalCount : postsPerPageOption;
  const numberOfPages = Math.max(1, Math.ceil(totalCount / postsPerPage));

  const pages: BlogPaginated[] = [];

  function permalink(page: number) {
    return page > 0
      ? normalizeUrl([basePageUrl, pageBasePath, `${page + 1}`])
      : basePageUrl;
  }

  for (let page = 0; page < numberOfPages; page += 1) {
    pages.push({
      items: blogPosts
        .slice(page * postsPerPage, (page + 1) * postsPerPage)
        .map((item) => item.id),
      metadata: {
        permalink: permalink(page),
        page: page + 1,
        postsPerPage,
        totalPages: numberOfPages,
        totalCount,
        previousPage: page !== 0 ? permalink(page - 1) : undefined,
        nextPage: page < numberOfPages - 1 ? permalink(page + 1) : undefined,
        blogDescription,
        blogTitle,
      },
    });
  }

  return pages;
}

export function shouldBeListed(blogPost: BlogPost): boolean {
  return !blogPost.metadata.unlisted;
}

export function getBlogTags({
  blogPosts,
  ...params
}: {
  blogPosts: BlogPost[];
  blogTitle: string;
  blogDescription: string;
  postsPerPageOption: number | 'ALL';
  pageBasePath: string;
}): BlogTags {
  const groups = groupTaggedItems(
    blogPosts,
    (blogPost) => blogPost.metadata.tags,
  );
  return _.mapValues(groups, ({tag, items: tagBlogPosts}) => {
    const tagVisibility = getTagVisibility({
      items: tagBlogPosts,
      isUnlisted: (item) => item.metadata.unlisted,
    });
    return {
      inline: tag.inline,
      label: tag.label,
      permalink: tag.permalink,
      description: tag.description,
      items: tagVisibility.listedItems.map((item) => item.id),
      pages: paginateBlogPosts({
        blogPosts: tagVisibility.listedItems,
        basePageUrl: tag.permalink,
        ...params,
      }),
      unlisted: tagVisibility.unlisted,
    };
  });
}

const DATE_FILENAME_REGEX =
  /^(?<folder>.*)(?<date>\d{4}[-/]\d{1,2}[-/]\d{1,2})[-/]?(?<text>.*?)(?:\/index)?.mdx?$/;

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
    const {folder, text, date: dateString} = dateFilenameMatch.groups!;
    // Always treat dates as UTC by adding the `Z`
    const date = new Date(`${dateString!}Z`);
    const slugDate = dateString!.replace(/-/g, '/');
    const slug = `/${slugDate}/${folder!}${text!}`;
    return {date, text: text!, slug};
  }
  const text = blogSourceRelative.replace(/(?:\/index)?\.mdx?$/, '');
  const slug = `/${text}`;
  return {date: undefined, text, slug};
}

async function parseBlogPostMarkdownFile({
  filePath,
  parseFrontMatter,
}: {
  filePath: string;
  parseFrontMatter: ParseFrontMatter;
}) {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  try {
    const result = await parseMarkdownFile({
      filePath,
      fileContent,
      parseFrontMatter,
      removeContentTitle: true,
    });
    return {
      ...result,
      frontMatter: validateBlogPostFrontMatter(result.frontMatter),
    };
  } catch (err) {
    logger.error`Error while parsing blog post file path=${filePath}.`;
    throw err;
  }
}

const defaultReadingTime: ReadingTimeFunction = ({content, locale, options}) =>
  calculateReadingTime(content, locale, options);

async function processBlogSourceFile(
  blogSourceRelative: string,
  contentPaths: BlogContentPaths,
  context: LoadContext,
  options: PluginOptions,
  tagsFile: TagsFile | null,
  authorsMap?: AuthorsMap,
): Promise<BlogPost | undefined> {
  const {
    siteConfig: {
      baseUrl,
      markdown: {parseFrontMatter},
    },
    siteDir,
    i18n,
  } = context;
  const {
    routeBasePath,
    tagsBasePath: tagsRouteBasePath,
    truncateMarker,
    showReadingTime,
    editUrl,
  } = options;

  // Lookup in localized folder in priority
  const blogDirPath = await getFolderContainingFile(
    getContentPathList(contentPaths),
    blogSourceRelative,
  );

  const blogSourceAbsolute = path.join(blogDirPath, blogSourceRelative);

  const {frontMatter, content, contentTitle, excerpt} =
    await parseBlogPostMarkdownFile({
      filePath: blogSourceAbsolute,
      parseFrontMatter,
    });

  const aliasedSource = aliasedSitePath(blogSourceAbsolute, siteDir);

  const lastUpdate = await readLastUpdateData(
    blogSourceAbsolute,
    options,
    frontMatter.last_update,
  );

  const draft = isDraft({frontMatter});
  const unlisted = isUnlisted({frontMatter});

  if (draft) {
    return undefined;
  }

  if (frontMatter.id) {
    logger.warn`name=${'id'} header option is deprecated in path=${blogSourceRelative} file. Please use name=${'slug'} option instead.`;
  }

  const parsedBlogFileName = parseBlogFileName(blogSourceRelative);

  async function getDate(): Promise<Date> {
    // Prefer user-defined date.
    if (frontMatter.date) {
      if (typeof frontMatter.date === 'string') {
        // Always treat dates as UTC by adding the `Z`
        return new Date(`${frontMatter.date}Z`);
      }
      // YAML only converts YYYY-MM-DD to dates and leaves others as strings.
      return frontMatter.date;
    } else if (parsedBlogFileName.date) {
      return parsedBlogFileName.date;
    }

    try {
      const result = await getFileCommitDate(blogSourceAbsolute, {
        age: 'oldest',
        includeAuthor: false,
      });

      return result.date;
    } catch (err) {
      logger.warn(err);
      return (await fs.stat(blogSourceAbsolute)).birthtime;
    }
  }

  const date = await getDate();

  const title = frontMatter.title ?? contentTitle ?? parsedBlogFileName.text;
  const description = frontMatter.description ?? excerpt ?? '';

  const slug = frontMatter.slug ?? parsedBlogFileName.slug;

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

  const tagsBaseRoutePath = normalizeUrl([
    baseUrl,
    routeBasePath,
    tagsRouteBasePath,
  ]);

  const authors = getBlogPostAuthors({authorsMap, frontMatter, baseUrl});
  reportAuthorsProblems({
    authors,
    blogSourceRelative,
    options,
  });

  const tags = normalizeTags({
    options,
    source: blogSourceRelative,
    frontMatterTags: frontMatter.tags,
    tagsBaseRoutePath,
    tagsFile,
  });

  return {
    id: slug,
    metadata: {
      permalink,
      editUrl: getBlogEditUrl(),
      source: aliasedSource,
      title,
      description,
      date,
      tags,
      readingTime: showReadingTime
        ? options.readingTime({
            content,
            frontMatter,
            defaultReadingTime,
            locale: i18n.currentLocale,
          })
        : undefined,
      hasTruncateMarker: truncateMarker.test(content),
      authors,
      frontMatter,
      unlisted,
      lastUpdatedAt: lastUpdate.lastUpdatedAt,
      lastUpdatedBy: lastUpdate.lastUpdatedBy,
    },
    content,
  };
}

export async function generateBlogPosts(
  contentPaths: BlogContentPaths,
  context: LoadContext,
  options: PluginOptions,
  authorsMap?: AuthorsMap,
): Promise<BlogPost[]> {
  const {include, exclude} = options;

  if (!(await fs.pathExists(contentPaths.contentPath))) {
    return [];
  }

  const blogSourceFiles = await Globby(include, {
    cwd: contentPaths.contentPath,
    ignore: exclude,
  });

  const tagsFile = await getTagsFile({contentPaths, tags: options.tags});

  async function doProcessBlogSourceFile(blogSourceFile: string) {
    try {
      return await processBlogSourceFile(
        blogSourceFile,
        contentPaths,
        context,
        options,
        tagsFile,
        authorsMap,
      );
    } catch (err) {
      throw new Error(
        `Processing of blog source file path=${blogSourceFile} failed.`,
        {cause: err as Error},
      );
    }
  }

  const blogPosts = (
    await Promise.all(blogSourceFiles.map(doProcessBlogSourceFile))
  ).filter(Boolean) as BlogPost[];

  blogPosts.sort(
    (a, b) => b.metadata.date.getTime() - a.metadata.date.getTime(),
  );

  if (options.sortPosts === 'ascending') {
    return blogPosts.reverse();
  }
  return blogPosts;
}

export async function applyProcessBlogPosts({
  blogPosts,
  processBlogPosts,
}: {
  blogPosts: BlogPost[];
  processBlogPosts: PluginOptions['processBlogPosts'];
}): Promise<BlogPost[]> {
  const processedBlogPosts = await processBlogPosts({blogPosts});

  if (Array.isArray(processedBlogPosts)) {
    return processedBlogPosts;
  }

  return blogPosts;
}
