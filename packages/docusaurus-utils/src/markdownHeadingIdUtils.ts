/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createSlugger, type Slugger, type SluggerOptions} from './slugger';

/**
 * The syntax to use for heading IDs.
 * - `classic` => `{#id}` (invalid MDX, but commonly supported)
 * - `mdx-comment` => `{/* #id * /}` (valid MDX)
 */
export type HeadingIdSyntax = 'classic' | 'mdx-comment';

/**
 * Parses custom ID from a heading. The ID can contain any characters except
 * `{#` and `}`.
 *
 * @param heading e.g. `## Some heading {#some-heading}` where the last
 * character must be `}` for the ID to be recognized
 * @param syntax which heading ID syntax to recognize
 */
export function parseMarkdownHeadingId(
  heading: string,
  syntax: HeadingIdSyntax = 'classic',
): {
  /**
   * The heading content sans the ID part, right-trimmed. e.g. `## Some heading`
   */
  text: string;
  /** The heading ID. e.g. `some-heading` */
  id: string | undefined;
} {
  // Classic syntax: {#my-id}
  if (syntax === 'classic') {
    const customHeadingIdRegex = /\s*\{#(?<id>(?:.(?!\{#|\}))*.)\}$/;
    const matches = customHeadingIdRegex.exec(heading);
    if (matches) {
      return {
        text: heading.replace(matches[0]!, ''),
        id: matches.groups!.id!,
      };
    }
  }
  // MDX comment syntax: {/* #my-id */}
  // Note: this is only used for the "write-heading-ids" CLI
  // The mdx loader is using a real MDX parser to find these comments
  else if (syntax === 'mdx-comment') {
    const mdxCommentHeadingIdRegex = /\s*\{\/\*\s*#(?<id>\S+)\s*\*\/\}$/;
    const mdxMatches = mdxCommentHeadingIdRegex.exec(heading);
    if (mdxMatches) {
      return {
        text: heading.replace(mdxMatches[0]!, ''),
        id: mdxMatches.groups!.id!,
      };
    }
  }
  // Unhandled cases, shouldn't happen
  else {
    throw new Error(`unknown heading id syntax '${syntax}'`);
  }
  return {text: heading, id: undefined};
}

/**
 * For our classic syntax, MDX v2+ now requires escaping { to compile: \{#id}.
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

function addHeadingId(
  line: string,
  slugger: Slugger,
  maintainCase: boolean,
  syntax: HeadingIdSyntax,
): string {
  let headingLevel = 0;
  while (line.charAt(headingLevel) === '#') {
    headingLevel += 1;
  }

  const headingHashes = line.slice(0, headingLevel);

  const headingContent = line.slice(headingLevel).trimEnd();

  // Unwrap links
  // "[ Hello](https://example.com) World " => "Hello world"
  const headingText = headingContent
    .replace(/\[(?<alt>[^\]]+)\]\([^)]+\)/g, (_match, p1: string) => p1)
    .trim();

  const slug = slugger.slug(headingText, {
    maintainCase,
  });

  const headingIdSuffix =
    syntax === 'mdx-comment' ? `{/* #${slug} */}` : `{#${slug}}`;

  return `${headingHashes}${headingContent} ${headingIdSuffix}`;
}

export type WriteHeadingIDOptions = SluggerOptions & {
  /** Overwrite existing heading IDs. */
  overwrite?: boolean;
  syntax?: HeadingIdSyntax;
};

/**
 * Takes Markdown content, returns new content with heading IDs written.
 * Respects existing IDs (unless `overwrite=true`) and never generates colliding
 * IDs (through the slugger).
 */
export function writeMarkdownHeadingId(
  content: string,
  options: WriteHeadingIDOptions = {},
): string {
  const {
    maintainCase = false,
    overwrite = false,
    syntax = 'classic', // Maybe we'll want to change this default later?
  } = options;
  const lines = content.split('\n');
  const slugger = createSlugger();

  // Parse heading ID trying both syntaxes (classic first, then mdx-comment)
  function parseHeadingIdAnySyntax(heading: string) {
    const classic = parseMarkdownHeadingId(heading, 'classic');
    if (classic.id) {
      return classic;
    }
    return parseMarkdownHeadingId(heading, 'mdx-comment');
  }

  // If we can't overwrite existing slugs, make sure other headings don't
  // generate colliding slugs by first marking these slugs as occupied
  if (!overwrite) {
    lines.forEach((line) => {
      const parsedHeading = parseHeadingIdAnySyntax(line);
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
      const parsedHeading = parseHeadingIdAnySyntax(line);

      // Do not process if id is already there
      if (parsedHeading.id && !overwrite) {
        return line;
      }
      return addHeadingId(parsedHeading.text, slugger, maintainCase, syntax);
    })
    .join('\n');
}
