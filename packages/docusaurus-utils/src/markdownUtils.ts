/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import matter from 'gray-matter';
import {createSlugger, type Slugger} from './slugger';

// Input: ## Some heading {#some-heading}
// Output: {text: "## Some heading", id: "some-heading"}
export function parseMarkdownHeadingId(heading: string): {
  text: string;
  id?: string;
} {
  const customHeadingIdRegex = /\s*\{#(?<id>[\w-]+)\}$/;
  const matches = customHeadingIdRegex.exec(heading);
  if (matches) {
    return {
      text: heading.replace(matches[0]!, ''),
      id: matches.groups!.id!,
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
      const codeFence = fileLine.trim().match(/^`+/)![0]!;
      if (!inCode) {
        inCode = true;
        lastCodeFence = codeFence;
        // If we are in a ````-fenced block, all ``` would be plain text instead
        // of fences
      } else if (codeFence.length >= lastCodeFence.length) {
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
      .replace(/^#[^#]+#?/gm, '')
      // Remove Markdown + ATX-style headers
      .replace(/^#{1,6}\s*(?<text>[^#]*)\s*#{0,6}/gm, '$1')
      // Remove emphasis.
      .replace(/(?<opening>[*_]{1,3})(?<text>.*?)\1/g, '$2')
      // Remove strikethroughs.
      .replace(/~~(?<text>\S.*\S)~~/g, '$1')
      // Remove images.
      .replace(/!\[(?<alt>.*?)\][[(].*?[\])]/g, '$1')
      // Remove footnotes.
      .replace(/\[\^.+?\](?:: .*$)?/g, '')
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
      .replace(/\{#*[\w-]+\}/, '')
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
  // We only need to detect import statements that will be parsed by MDX as
  // `import` nodes, as broken syntax can't render anyways. That means any block
  // that has `import` at the very beginning and surrounded by empty lines.
  const contentWithoutImport = content
    .replace(/^(?:import\s(?:.|\n(?!\n))*\n{2,})*/, '')
    .trim();

  const regularTitleMatch = /^#[ \t]+(?<title>[^ \t].*)(?:\n|$)/.exec(
    contentWithoutImport,
  );
  const alternateTitleMatch = /^(?<title>.*)\n=+(?:\n|$)/.exec(
    contentWithoutImport,
  );

  const titleMatch = regularTitleMatch ?? alternateTitleMatch;
  if (!titleMatch) {
    return {content, contentTitle: undefined};
  }
  const newContent = removeContentTitleOption
    ? content.replace(titleMatch[0]!, '')
    : content;
  if (regularTitleMatch) {
    return {
      content: newContent.trim(),
      contentTitle: toTextContentTitle(
        regularTitleMatch
          .groups!.title!.trim()
          .replace(/\s*(?:\{#*[\w-]+\}|#+)$/, ''),
      ).trim(),
    };
  }
  return {
    content: newContent.trim(),
    contentTitle: toTextContentTitle(
      alternateTitleMatch!.groups!.title!.trim().replace(/\s*=+$/, ''),
    ).trim(),
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

function unwrapMarkdownLinks(line: string): string {
  return line.replace(/\[(?<alt>[^\]]+)\]\([^)]+\)/g, (match, p1) => p1);
}

function addHeadingId(
  line: string,
  slugger: Slugger,
  maintainCase: boolean,
): string {
  let headingLevel = 0;
  while (line.charAt(headingLevel) === '#') {
    headingLevel += 1;
  }

  const headingText = line.slice(headingLevel).trimEnd();
  const headingHashes = line.slice(0, headingLevel);
  const slug = slugger.slug(unwrapMarkdownLinks(headingText).trim(), {
    maintainCase,
  });

  return `${headingHashes}${headingText} {#${slug}}`;
}

export type WriteHeadingIDOptions = {
  maintainCase?: boolean;
  overwrite?: boolean;
};

export function writeMarkdownHeadingId(
  content: string,
  options: WriteHeadingIDOptions = {maintainCase: false, overwrite: false},
): string {
  const {maintainCase = false, overwrite = false} = options;
  const lines = content.split('\n');
  const slugger = createSlugger();

  // If we can't overwrite existing slugs, make sure other headings don't
  // generate colliding slugs by first marking these slugs as occupied
  if (!overwrite) {
    lines.forEach((line) => {
      const parsedHeading = parseMarkdownHeadingId(line);
      if (parsedHeading.id) {
        slugger.slug(parsedHeading.id);
      }
    });
  }

  let inCode = false;
  return lines
    .map((line) => {
      if (line.startsWith('```')) {
        inCode = !inCode;
        return line;
      }
      // Ignore h1 headings, as we don't create anchor links for those
      if (inCode || !line.startsWith('##')) {
        return line;
      }
      const parsedHeading = parseMarkdownHeadingId(line);

      // Do not process if id is already there
      if (parsedHeading.id && !overwrite) {
        return line;
      }
      return addHeadingId(parsedHeading.text, slugger, maintainCase);
    })
    .join('\n');
}
