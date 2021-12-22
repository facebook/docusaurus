/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import matter from 'gray-matter';

// Hacky way of stripping out import statements from the excerpt
// TODO: Find a better way to do so, possibly by compiling the Markdown content,
// stripping out HTML tags and obtaining the first line.
export function createExcerpt(fileString: string): string | undefined {
  const fileLines = fileString
    .trimLeft()
    // Remove Markdown alternate title
    .replace(/^[^\n]*\n[=]+/g, '')
    .split('\n');
  let inCode = false;

  /* eslint-disable no-continue */
  // eslint-disable-next-line no-restricted-syntax
  for (const fileLine of fileLines) {
    // Skip empty line.
    if (!fileLine.trim()) {
      continue;
    }

    // Skip import/export declaration.
    if (/^\s*?import\s.*(from.*)?;?|export\s.*{.*};?/.test(fileLine)) {
      continue;
    }

    // Skip code block line.
    if (fileLine.trim().startsWith('```')) {
      inCode = !inCode;
      continue;
    } else if (inCode) {
      continue;
    }

    const cleanedLine = fileLine
      // Remove HTML tags.
      .replace(/<[^>]*>/g, '')
      // Remove Title headers
      .replace(/^#\s*([^#]*)\s*#?/gm, '')
      // Remove Markdown + ATX-style headers
      .replace(/^#{1,6}\s*([^#]*)\s*(#{1,6})?/gm, '$1')
      // Remove emphasis and strikethroughs.
      .replace(/([*_~]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      // Remove images.
      .replace(/!\[(.*?)\][[(].*?[\])]/g, '$1')
      // Remove footnotes.
      .replace(/\[\^.+?\](: .*?$)?/g, '')
      // Remove inline links.
      .replace(/\[(.*?)\][[(].*?[\])]/g, '$1')
      // Remove inline code.
      .replace(/`(.+?)`/g, '$1')
      // Remove blockquotes.
      .replace(/^\s{0,3}>\s?/g, '')
      // Remove admonition definition.
      .replace(/(:{3}.*)/, '')
      // Remove Emoji names within colons include preceding whitespace.
      .replace(/\s?(:(::|[^:\n])+:)/g, '')
      // Remove custom Markdown heading id.
      .replace(/{#*[\w-]+}/, '')
      .trim();

    if (cleanedLine) {
      return cleanedLine;
    }
  }

  return undefined;
}

export function parseFrontMatter(markdownFileContent: string): {
  frontMatter: Record<string, unknown>;
  content: string;
} {
  const {data, content} = matter(markdownFileContent);
  return {
    frontMatter: data ?? {},
    content: content?.trim() ?? '',
  };
}

// Try to convert markdown heading as text
// Does not need to be perfect, it is only used as a fallback when frontMatter.title is not provided
// For now, we just unwrap possible inline code blocks (# `config.js`)
function toTextContentTitle(contentTitle: string): string {
  if (contentTitle.startsWith('`') && contentTitle.endsWith('`')) {
    return contentTitle.substring(1, contentTitle.length - 1);
  }
  return contentTitle;
}

export function parseMarkdownContentTitle(
  contentUntrimmed: string,
  options?: {removeContentTitle?: boolean},
): {content: string; contentTitle: string | undefined} {
  const removeContentTitleOption = options?.removeContentTitle ?? false;

  const content = contentUntrimmed.trim();

  const IMPORT_STATEMENT =
    /import\s+(([\w*{}\s\n,]+)from\s+)?["'\s]([@\w/_.-]+)["'\s];?|\n/.source;
  const REGULAR_TITLE =
    /(?<pattern>#\s*(?<title>[^#\n{]*)+[ \t]*(?<suffix>({#*[\w-]+})|#)?\n*?)/
      .source;
  const ALTERNATE_TITLE = /(?<pattern>\s*(?<title>[^\n]*)\s*\n[=]+)/.source;

  const regularTitleMatch = new RegExp(
    `^(?:${IMPORT_STATEMENT})*?${REGULAR_TITLE}`,
    'g',
  ).exec(content);
  const alternateTitleMatch = new RegExp(
    `^(?:${IMPORT_STATEMENT})*?${ALTERNATE_TITLE}`,
    'g',
  ).exec(content);

  const titleMatch = regularTitleMatch ?? alternateTitleMatch;
  const {pattern, title} = titleMatch?.groups ?? {};

  if (!pattern || !title) {
    return {content, contentTitle: undefined};
  } else {
    const newContent = removeContentTitleOption
      ? content.replace(pattern, '')
      : content;
    return {
      content: newContent.trim(),
      contentTitle: toTextContentTitle(title.trim()).trim(),
    };
  }
}

type ParsedMarkdown = {
  frontMatter: Record<string, unknown>;
  content: string;
  contentTitle: string | undefined;
  excerpt: string | undefined;
};

export function parseMarkdownString(
  markdownFileContent: string,
  options?: {removeContentTitle?: boolean},
): ParsedMarkdown {
  try {
    const {frontMatter, content: contentWithoutFrontMatter} =
      parseFrontMatter(markdownFileContent);

    const {content, contentTitle} = parseMarkdownContentTitle(
      contentWithoutFrontMatter,
      options,
    );

    const excerpt = createExcerpt(content);

    return {
      frontMatter,
      content,
      contentTitle,
      excerpt,
    };
  } catch (e) {
    logger.error(`Error while parsing Markdown frontmatter.
This can happen if you use special characters in frontmatter values (try using double quotes around that value).`);
    throw e;
  }
}

export async function parseMarkdownFile(
  source: string,
  options?: {removeContentTitle?: boolean},
): Promise<ParsedMarkdown> {
  const markdownString = await fs.readFile(source, 'utf-8');
  try {
    return parseMarkdownString(markdownString, options);
  } catch (e) {
    throw new Error(
      `Error while parsing Markdown file ${source}: "${(e as Error).message}".`,
    );
  }
}
