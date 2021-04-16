/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chalk from 'chalk';
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

    const cleanedLine = fileLine
      // Remove HTML tags.
      .replace(/<[^>]*>/g, '')
      // Remove Title headers
      .replace(/^\#\s*([^#]*)\s*\#?/gm, '')
      // Remove Markdown + ATX-style headers
      .replace(/^\#{1,6}\s*([^#]*)\s*(\#{1,6})?/gm, '$1')
      // Remove emphasis and strikethroughs.
      .replace(/([\*_~]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      // Remove images.
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove footnotes.
      .replace(/\[\^.+?\](\: .*?$)?/g, '')
      // Remove inline links.
      .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove inline code.
      .replace(/`(.+?)`/g, '$1')
      // Remove blockquotes.
      .replace(/^\s{0,3}>\s?/g, '')
      // Remove admonition definition.
      .replace(/(:{3}.*)/, '')
      // Remove Emoji names within colons include preceding whitespace.
      .replace(/\s?(:(::|[^:\n])+:)/g, '')
      .trim();

    if (cleanedLine) {
      return cleanedLine;
    }
  }

  return undefined;
}

export function parseFrontMatter(
  markdownFileContent: string,
): {
  frontMatter: Record<string, unknown>;
  content: string;
} {
  const {data, content} = matter(markdownFileContent);
  return {
    frontMatter: data ?? {},
    content: content?.trim() ?? '',
  };
}

export function parseMarkdownContentTitle(
  contentUntrimmed: string,
  options?: {keepContentTitle?: boolean},
): {content: string; contentTitle: string | undefined} {
  const keepContentTitleOption = options?.keepContentTitle ?? false;

  const content = contentUntrimmed.trim();

  const regularTitleMatch = /^(?<pattern>#\s*(?<title>[^#\n]*)+\s*#*[\s\r]*?\n*?)/g.exec(
    content,
  );
  const alternateTitleMatch = /^(?<pattern>\s*(?<title>[^\n]*)\s*\n[=]+)/g.exec(
    content,
  );

  const titleMatch = regularTitleMatch ?? alternateTitleMatch;
  const {pattern, title} = titleMatch?.groups ?? {};

  if (!pattern || !title) {
    return {content, contentTitle: undefined};
  }

  const newContent = keepContentTitleOption
    ? content
    : content.replace(pattern, '');

  return {
    content: newContent.trim(),
    contentTitle: title.trim(),
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
  options?: {
    source?: string;
    keepContentTitle?: boolean;
  },
): ParsedMarkdown {
  try {
    const sourceOption = options?.source;
    const keepContentTitle = options?.keepContentTitle ?? false;

    const {frontMatter, content: contentWithoutFrontMatter} = parseFrontMatter(
      markdownFileContent,
    );

    const {content, contentTitle} = parseMarkdownContentTitle(
      contentWithoutFrontMatter,
      {
        keepContentTitle,
      },
    );

    const excerpt = createExcerpt(content);

    // TODO not sure this is a good place for this warning
    if (
      frontMatter.title &&
      contentTitle &&
      !keepContentTitle &&
      !(process.env.DOCUSAURUS_NO_DUPLICATE_TITLE_WARNING === 'false')
    ) {
      console.warn(
        chalk.yellow(`Duplicate title found in ${sourceOption ?? 'this'} file.
Use either a frontmatter title or a markdown title, not both.
If this is annoying you, use env DOCUSAURUS_NO_DUPLICATE_TITLE_WARNING=false`),
      );
    }

    return {
      frontMatter,
      content,
      contentTitle,
      excerpt,
    };
  } catch (e) {
    console.error(
      chalk.red(`Error while parsing markdown front matter.
This can happen if you use special characters like : in frontmatter values (try using "" around that value)`),
    );
    throw e;
  }
}

export async function parseMarkdownFile(
  source: string,
): Promise<ParsedMarkdown> {
  const markdownString = await fs.readFile(source, 'utf-8');
  try {
    return parseMarkdownString(markdownString, {source});
  } catch (e) {
    throw new Error(
      `Error while parsing markdown file ${source}
${e.message}`,
    );
  }
}
