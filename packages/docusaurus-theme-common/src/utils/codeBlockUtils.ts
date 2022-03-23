/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rangeParser from 'parse-numeric-range';

const codeBlockTitleRegex = /title=(?<quote>["'])(?<title>.*?)\1/;
const highlightLinesRangeRegex = /\{(?<range>[\d,-]+)\}/;

// Supported types of highlight comments
const commentPatterns = {
  js: {start: '\\/\\/', end: ''},
  jsBlock: {start: '\\/\\*', end: '\\*\\/'},
  jsx: {start: '\\{\\s*\\/\\*', end: '\\*\\/\\s*\\}'},
  python: {start: '#', end: ''},
  html: {start: '<!--', end: '-->'},
};

type CommentType = keyof typeof commentPatterns;

const magicCommentDirectives = [
  'highlight-next-line',
  'highlight-start',
  'highlight-end',
];

function getCommentPattern(languages: CommentType[]) {
  // to be more reliable, the opening and closing comment must match
  const commentPattern = languages
    .map((lang) => {
      const {start, end} = commentPatterns[lang];
      return `(?:${start}\\s*(${magicCommentDirectives.join('|')})\\s*${end})`;
    })
    .join('|');
  // white space is allowed, but otherwise it should be on it's own line
  return new RegExp(`^\\s*(?:${commentPattern})\\s*$`);
}

/**
 * Select comment styles based on language
 */
function getAllMagicCommentDirectiveStyles(lang: string) {
  switch (lang) {
    case 'js':
    case 'javascript':
    case 'ts':
    case 'typescript':
      return getCommentPattern(['js', 'jsBlock']);

    case 'jsx':
    case 'tsx':
      return getCommentPattern(['js', 'jsBlock', 'jsx']);

    case 'html':
      return getCommentPattern(['js', 'jsBlock', 'html']);

    case 'python':
    case 'py':
      return getCommentPattern(['python']);

    default:
      // all comment types
      return getCommentPattern(Object.keys(commentPatterns) as CommentType[]);
  }
}

export function parseCodeBlockTitle(metastring?: string): string {
  return metastring?.match(codeBlockTitleRegex)?.groups!.title ?? '';
}

/**
 * Gets the language name from the class name (set by MDX).
 * e.g. `"language-javascript"` => `"javascript"`.
 * Returns undefined if there is no language class name.
 */
export function parseLanguage(className: string): string | undefined {
  const languageClassName = className
    .split(' ')
    .find((str) => str.startsWith('language-'));
  return languageClassName?.replace(/language-/, '');
}

/**
 * Parses the code content, strips away any magic comments, and returns the
 * clean content and the highlighted lines marked by the comments or metastring.
 *
 * If the metastring contains highlight range, the `content` will be returned
 * as-is without any parsing.
 *
 * @param content The raw code with magic comments. Trailing newline will be
 * trimmed upfront.
 * @param metastring The full metastring, as received from MDX. Highlight range
 * declared here starts at 1.
 * @param language Language of the code block, used to determine which kinds of
 * magic comment styles to enable.
 */
export function parseLines(
  content: string,
  metastring?: string,
  language?: string,
): {
  /**
   * The highlighted lines, 0-indexed. e.g. `[0, 1, 4]` means the 1st, 2nd, and
   * 5th lines are highlighted.
   */
  highlightLines: number[];
  /**
   * The clean code without any magic comments (only if highlight range isn't
   * present in the metastring).
   */
  code: string;
} {
  let code = content.replace(/\n$/, '');
  // Highlighted lines specified in props: don't parse the content
  if (metastring && highlightLinesRangeRegex.test(metastring)) {
    const highlightLinesRange = metastring.match(highlightLinesRangeRegex)!
      .groups!.range!;
    const highlightLines = rangeParser(highlightLinesRange)
      .filter((n) => n > 0)
      .map((n) => n - 1);
    return {highlightLines, code};
  }
  if (language === undefined) {
    return {highlightLines: [], code};
  }
  const directiveRegex = getAllMagicCommentDirectiveStyles(language);
  // go through line by line
  const lines = code.split('\n');
  let highlightBlockStart: number;
  let highlightRange = '';
  // loop through lines
  for (let lineNumber = 0; lineNumber < lines.length; ) {
    const line = lines[lineNumber]!;
    const match = line.match(directiveRegex);
    if (match !== null) {
      const directive = match.slice(1).find((item) => item !== undefined);
      switch (directive) {
        case 'highlight-next-line':
          highlightRange += `${lineNumber},`;
          break;

        case 'highlight-start':
          highlightBlockStart = lineNumber;
          break;

        case 'highlight-end':
          highlightRange += `${highlightBlockStart!}-${lineNumber - 1},`;
          break;

        default:
          break;
      }
      lines.splice(lineNumber, 1);
    } else {
      // lines without directives are unchanged
      lineNumber += 1;
    }
  }
  const highlightLines = rangeParser(highlightRange);
  code = lines.join('\n');
  return {highlightLines, code};
}
