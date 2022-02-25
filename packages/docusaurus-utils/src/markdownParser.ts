/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import matter from 'gray-matter';

// Input: ## Some heading {#some-heading}
// Output: {text: "## Some heading", id: "some-heading"}
export function parseMarkdownHeadingId(heading: string): {
  text: string;
  id?: string;
} {
  const customHeadingIdRegex = /^(?<text>.*?)\s*\{#(?<id>[\w-]+)\}$/;
  const matches = customHeadingIdRegex.exec(heading);
  if (matches) {
    return {
      text: matches.groups!.text,
      id: matches.groups!.id,
    };
  }
  return {text: heading, id: undefined};
}

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
  let lastCodeFence = '';

  /* eslint-disable no-continue */
  for (const fileLine of fileLines) {
    // Skip empty line.
    if (!fileLine.trim()) {
      continue;
    }

    // Skip import/export declaration.
    if (/^(?:import|export)\s.*/.test(fileLine)) {
      continue;
    }

    // Skip code block line.
    if (fileLine.trim().startsWith('```')) {
      if (!inCode) {
        inCode = true;
        [lastCodeFence] = fileLine.trim().match(/^`+/)!;
        // If we are in a ````-fenced block, all ``` would be plain text instead
        // of fences
      } else if (
        fileLine.trim().match(/^`+/)![0].length >= lastCodeFence.length
      ) {
        inCode = false;
      }
      continue;
    } else if (inCode) {
      continue;
    }

    const cleanedLine = fileLine
      // Remove HTML tags.
      .replace(/<[^>]*>/g, '')
      // Remove Title headers
      .replace(/^#\s*[^#]*\s*#?/gm, '')
      // Remove Markdown + ATX-style headers
      .replace(/^#{1,6}\s*(?<text>[^#]*)\s*(?:#{1,6})?/gm, '$1')
      // Remove emphasis.
      .replace(/(?<opening>[*_]{1,3})(?<text>.*?)\1/g, '$2')
      // Remove strikethroughs.
      .replace(/~~(?<text>\S.*\S)~~/g, '$1')
      // Remove images.
      .replace(/!\[(?<alt>.*?)\][[(].*?[\])]/g, '$1')
      // Remove footnotes.
      .replace(/\[\^.+?\](?:: .*?$)?/g, '')
      // Remove inline links.
      .replace(/\[(?<alt>.*?)\][[(].*?[\])]/g, '$1')
      // Remove inline code.
      .replace(/`(?<text>.+?)`/g, '$1')
      // Remove blockquotes.
      .replace(/^\s{0,3}>\s?/g, '')
      // Remove admonition definition.
      .replace(/:::.*/, '')
      // Remove Emoji names within colons include preceding whitespace.
      .replace(/\s?:(?:::|[^:\n])+:/g, '')
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
    frontMatter: data,
    content: content.trim(),
  };
}

/**
 * Try to convert markdown heading to text. Does not need to be perfect, it is
 * only used as a fallback when frontMatter.title is not provided. For now, we
 * just unwrap possible inline code blocks (# `config.js`)
 */
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
    /import\s+(?:[\w*{}\s\n,]+from\s+)?["'\s][@\w/_.-]+["'\s];?|\n/.source;
  const REGULAR_TITLE =
    /(?<pattern>#\s*(?<title>[^#\n{]*)+[ \t]*(?<suffix>(?:{#*[\w-]+})|#)?\n*?)/
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
  }
  const newContent = removeContentTitleOption
    ? content.replace(pattern, '')
    : content;
  return {
    content: newContent.trim(),
    contentTitle: toTextContentTitle(title.trim()).trim(),
  };
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
  } catch (err) {
    logger.error(`Error while parsing Markdown front matter.
This can happen if you use special characters in front matter values (try using double quotes around that value).`);
    throw err;
  }
}
