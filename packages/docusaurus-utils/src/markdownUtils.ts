/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import matter from 'gray-matter';
import {remark} from 'remark';
import stripMarkdown from 'strip-markdown';
import {createSlugger, type Slugger, type SluggerOptions} from './slugger';
import type {
  ParseFrontMatter,
  DefaultParseFrontMatter,
} from '@docusaurus/types';

// Some utilities for parsing Markdown content. These things are only used on
// server-side when we infer metadata like `title` and `description` from the
// content. Most parsing is still done in MDX through the mdx-loader.

/**
 * Parses custom ID from a heading. The ID can contain any characters except
 * `{#` and `}`.
 *
 * @param heading e.g. `## Some heading {#some-heading}` where the last
 * character must be `}` for the ID to be recognized
 */
export function parseMarkdownHeadingId(heading: string): {
  /**
   * The heading content sans the ID part, right-trimmed. e.g. `## Some heading`
   */
  text: string;
  /** The heading ID. e.g. `some-heading` */
  id: string | undefined;
} {
  const customHeadingIdRegex = /\s*\{#(?<id>(?:.(?!\{#|\}))*.)\}$/;
  const matches = customHeadingIdRegex.exec(heading);
  if (matches) {
    return {
      text: heading.replace(matches[0]!, ''),
      id: matches.groups!.id!,
    };
  }
  return {text: heading, id: undefined};
}

/**
 * MDX 2 requires escaping { with a \ so our anchor syntax need that now.
 * See https://mdxjs.com/docs/troubleshooting-mdx/#could-not-parse-expression-with-acorn-error
 */
export function escapeMarkdownHeadingIds(content: string): string {
  const markdownHeadingRegexp = /(?:^|\n)#{1,6}(?!#).*/g;
  return content.replaceAll(markdownHeadingRegexp, (substring) =>
    // TODO probably not the most efficient impl...
    substring
      .replace('{#', '\\{#')
      // prevent duplicate escaping
      .replace('\\\\{#', '\\{#'),
  );
}

/**
 * Hacky temporary escape hatch for Crowdin bad MDX support
 * See https://docusaurus.io/docs/i18n/crowdin#mdx
 *
 * TODO Titus suggested a clean solution based on ```mdx eval and Remark
 * See https://github.com/mdx-js/mdx/issues/701#issuecomment-947030041
 *
 * @param content
 */
export function unwrapMdxCodeBlocks(content: string): string {
  // We only support 3/4 backticks on purpose, should be good enough
  const regexp3 =
    /(?<begin>^|\r?\n)(?<indentStart>\x20*)```(?<spaces>\x20*)mdx-code-block\r?\n(?<children>.*?)\r?\n(?<indentEnd>\x20*)```(?<end>\r?\n|$)/gs;
  const regexp4 =
    /(?<begin>^|\r?\n)(?<indentStart>\x20*)````(?<spaces>\x20*)mdx-code-block\r?\n(?<children>.*?)\r?\n(?<indentEnd>\x20*)````(?<end>\r?\n|$)/gs;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const replacer = (substring: string, ...args: any[]) => {
    const groups = args.at(-1);
    return `${groups.begin}${groups.children}${groups.end}`;
  };

  return content.replaceAll(regexp3, replacer).replaceAll(regexp4, replacer);
}

/**
 * Add support for our legacy ":::note Title" admonition syntax
 * Not supported by https://github.com/remarkjs/remark-directive
 * Syntax is transformed to ":::note[Title]" (container directive label)
 * See https://talk.commonmark.org/t/generic-directives-plugins-syntax/444
 *
 * @param content
 * @param admonitionContainerDirectives
 */
export function admonitionTitleToDirectiveLabel(
  content: string,
  admonitionContainerDirectives: string[],
): string {
  // this will also process ":::note Title" inside docs code blocks
  // good enough: we fixed older versions docs to not be affected

  const directiveNameGroup = `(${admonitionContainerDirectives.join('|')})`;
  const regexp = new RegExp(
    `^(?<quote>(> ?)*)(?<indentation>( +|\t+))?(?<directive>:{3,}${directiveNameGroup}) +(?<title>.*)$`,
    'gm',
  );

  return content.replaceAll(regexp, (substring, ...args: any[]) => {
    const groups = args.at(-1);

    return `${groups.quote ?? ''}${groups.indentation ?? ''}${
      groups.directive
    }[${groups.title}]`;
  });
}

// TODO: Find a better way to do so, possibly by compiling the Markdown content,
// stripping out HTML tags and obtaining the first line.
// TODO: remove this function in favor of MDXv3 `data.excerpt`
// We keep it for now only for MDX v1/v2 backward compatibility
/**
 * Creates an excerpt of a Markdown file. This function will:
 *
 * - Ignore h1 headings (setext or atx)
 * - Ignore import/export
 * - Ignore code blocks
 *
 * And for the first contentful line, it will strip away most Markdown
 * syntax, including HTML tags, emphasis, links (keeping the text), etc.
 */
export function createExcerpt(fileString: string): string | undefined {
  // Remove front matter.
  const {content: contentWithoutFrontMatter} = parseFileContentFrontMatter(fileString);

  // TODO: remark-strip-markdown has a bug with ATX headings inside blockquotes
  // See https://github.com/remarkjs/remark-strip-markdown/issues/12
  // We'll use a simpler regex-based approach for now, as this function is
  // deprecated anyway.
  // const strippedContent = remark()
  //   .use(stripMarkdown, {
  //     remove: [
  //       // Remove import/export statements
  //       {type: 'mdxjsEsm'},
  //       // Remove code blocks
  //       {type: 'code'},
  //       // Remove thematic breaks
  //       {type: 'thematicBreak'},
  //       // Remove tables
  //       {type: 'table'},
  //       // Remove blockquotes, lists (handled by line iteration)
  //     ],
  //     // Keep headings to filter H1s later, keep paragraphs for content
  //     keep: ['heading', 'paragraph', 'text'],
  //   })
  //   .processSync(contentWithoutFrontMatter)
  //   .toString();

  // Fallback to existing regex-based implementation due to issues with remark-strip-markdown
  // The original implementation is more battle-tested for Docusaurus's use-case.
  // This function is deprecated and will be removed in MDXv3.

  const fileLines = contentWithoutFrontMatter
    .trimStart()
    // Remove Markdown alternate title (h1 setext)
    .replace(/^[^\r\n]*\r?\n(?:={3,}|-{3,})\s*$/gm, '')
    .split(/\r?\n/);

  let inCode = false;
  let inImport = false; // Still useful for multi-line imports not caught by mdxjsEsm
  let lastCodeFence = '';

  for (const fileLine of fileLines) {
    const trimmedLine = fileLine.trim();

    // An empty line marks the end of imports
    if (!trimmedLine && inImport) {
      inImport = false;
    }

    // Skip empty line.
    if (!trimmedLine) {
      continue;
    }

    // Skip import/export declaration.
    // remark-strip-markdown with mdxjsEsm should handle most, but this catches multi-line cases.
    if ((/^(?:import|export)\s.*/.test(trimmedLine) || inImport) && !inCode) {
      inImport = true;
      continue;
    }

    // Skip H1 ATX headings
    if (/^#\s.*/.test(trimmedLine)) {
      continue;
    }

    // Skip code block line.
    if (trimmedLine.startsWith('```')) {
      const codeFence = trimmedLine.match(/^`+/)![0]!;
      if (!inCode) {
        inCode = true;
        lastCodeFence = codeFence;
      } else if (codeFence.length >= lastCodeFence.length) {
        inCode = false;
      }
      continue;
    } else if (inCode) {
      continue;
    }

    // Use remark and strip-markdown for robust cleaning of the line
    const cleanedLine = remark()
      .use(stripMarkdown)
      .processSync(fileLine)
      .toString()
      .trim();

    if (cleanedLine) {
      return cleanedLine;
    }
  }

  return undefined;
}

/**
 * Takes a raw Markdown file content, and parses the front matter using
 * gray-matter. Worth noting that gray-matter accepts TOML and other markup
 * languages as well.
 *
 * @throws Throws when gray-matter throws. e.g.:
 * ```md
 * ---
 * foo: : bar
 * ---
 * ```
 */
export function parseFileContentFrontMatter(fileContent: string): {
  /** Front matter as parsed by gray-matter. */
  frontMatter: {[key: string]: unknown};
  /** The remaining content, trimmed. */
  content: string;
} {
  // TODO Docusaurus v4: replace gray-matter by a better lib
  // gray-matter is unmaintained, not flexible, and the code doesn't look good
  const {data, content} = matter(fileContent);

  // gray-matter has an undocumented front matter caching behavior
  // https://github.com/jonschlinkert/gray-matter/blob/ce67a86dba419381db0dd01cc84e2d30a1d1e6a5/index.js#L39
  // Unfortunately, this becomes a problem when we mutate returned front matter
  // We want to make it possible as part of the parseFrontMatter API
  // So we make it safe to mutate by always providing a deep copy
  const frontMatter =
    // And of course structuredClone() doesn't work well with Date in Jest...
    // See https://github.com/jestjs/jest/issues/2549
    // So we parse again for tests with a {} option object
    // This undocumented empty option object disables gray-matter caching..
    process.env.JEST_WORKER_ID
      ? matter(fileContent, {}).data
      : structuredClone(data);

  return {
    frontMatter,
    content: content.trim(),
  };
}

export const DEFAULT_PARSE_FRONT_MATTER: DefaultParseFrontMatter = async (
  params,
) => parseFileContentFrontMatter(params.fileContent);

function toTextContentTitle(contentTitle: string): string {
  return contentTitle.replace(/`(?<text>[^`]*)`/g, '$<text>');
}

type ParseMarkdownContentTitleOptions = {
  /**
   * If `true`, the matching title will be removed from the returned content.
   * We can promise that at least one empty line will be left between the
   * content before and after, but you shouldn't make too much assumption
   * about what's left.
   */
  removeContentTitle?: boolean;
};

/**
 * Takes the raw Markdown content, without front matter, and tries to find an h1
 * title (setext or atx) to be used as metadata.
 *
 * It only searches until the first contentful paragraph, ignoring import/export
 * declarations.
 *
 * It will try to convert markdown to reasonable text, but won't be best effort,
 * since it's only used as a fallback when `frontMatter.title` is not provided.
 * For now, we just unwrap inline code (``# `config.js` `` => `config.js`).
 */
export function parseMarkdownContentTitle(
  contentUntrimmed: string,
  options?: ParseMarkdownContentTitleOptions,
): {
  /** The content, optionally without the content title. */
  content: string;
  /** The title, trimmed and without the `#`. */
  contentTitle: string | undefined;
} {
  const removeContentTitleOption = options?.removeContentTitle ?? false;

  const content = contentUntrimmed.trim();
  // We only need to detect import statements that will be parsed by MDX as
  // `import` nodes, as broken syntax can't render anyways. That means any block
  // that has `import` at the very beginning and surrounded by empty lines.
  const contentWithoutImport = content
    .replace(/^(?:import\s(?:.|\r?\n(?!\r?\n))*(?:\r?\n){2,})*/, '')
    .trim();

  const regularTitleMatch = /^#[ \t]+(?<title>[^ \t].*)(?:\r?\n|$)/.exec(
    contentWithoutImport,
  );
  const alternateTitleMatch = /^(?<title>.*)\r?\n=+(?:\r?\n|$)/.exec(
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

/**
 * Makes a full-round parse.
 *
 * @throws Throws when `parseFrontMatter` throws, usually because of invalid
 * syntax.
 */
export async function parseMarkdownFile({
  filePath,
  fileContent,
  parseFrontMatter,
  removeContentTitle,
}: {
  filePath: string;
  fileContent: string;
  parseFrontMatter: ParseFrontMatter;
} & ParseMarkdownContentTitleOptions): Promise<{
  /** @see {@link parseFrontMatter} */
  frontMatter: {[key: string]: unknown};
  /** @see {@link parseMarkdownContentTitle} */
  contentTitle: string | undefined;
  /** @see {@link createExcerpt} */
  excerpt: string | undefined;
  /**
   * Content without front matter and (optionally) without title, depending on
   * the `removeContentTitle` option.
   */
  content: string;
}> {
  try {
    const {frontMatter, content: contentWithoutFrontMatter} =
      await parseFrontMatter({
        filePath,
        fileContent,
        defaultParseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
      });

    const {content, contentTitle} = parseMarkdownContentTitle(
      contentWithoutFrontMatter,
      {removeContentTitle},
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
  return line.replace(
    /\[(?<alt>[^\]]+)\]\([^)]+\)/g,
    (match, p1: string) => p1,
  );
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

export type WriteHeadingIDOptions = SluggerOptions & {
  /** Overwrite existing heading IDs. */
  overwrite?: boolean;
};

/**
 * Takes Markdown content, returns new content with heading IDs written.
 * Respects existing IDs (unless `overwrite=true`) and never generates colliding
 * IDs (through the slugger).
 */
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
