/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {CSSProperties} from 'react';
import rangeParser from 'parse-numeric-range';
import type {PrismTheme, PrismThemeEntry} from 'prism-react-renderer';

const codeBlockTitleRegex = /title=(?<quote>["'])(?<title>.*?)\1/;
const metastringLinesRangeRegex = /\{(?<range>[\d,-]+)\}/;

// Supported types of highlight comments
const commentPatterns = {
  js: {start: '\\/\\/', end: ''},
  jsBlock: {start: '\\/\\*', end: '\\*\\/'},
  jsx: {start: '\\{\\s*\\/\\*', end: '\\*\\/\\s*\\}'},
  bash: {start: '#', end: ''},
  html: {start: '<!--', end: '-->'},
  lua: {start: '--', end: ''},
  wasm: {start: '\\;\\;', end: ''},
  tex: {start: '%', end: ''},
};

type CommentType = keyof typeof commentPatterns;

export type MagicCommentConfig = {
  className: string;
  line?: string;
  block?: {start: string; end: string};
};

function getCommentPattern(
  languages: CommentType[],
  magicCommentDirectives: MagicCommentConfig[],
) {
  // To be more reliable, the opening and closing comment must match
  const commentPattern = languages
    .map((lang) => {
      const {start, end} = commentPatterns[lang];
      return `(?:${start}\\s*(${magicCommentDirectives
        .flatMap((d) => [d.line, d.block?.start, d.block?.end].filter(Boolean))
        .join('|')})\\s*${end})`;
    })
    .join('|');
  // White space is allowed, but otherwise it should be on it's own line
  return new RegExp(`^\\s*(?:${commentPattern})\\s*$`);
}

/**
 * Select comment styles based on language
 */
function getAllMagicCommentDirectiveStyles(
  lang: string,
  magicCommentDirectives: MagicCommentConfig[],
) {
  switch (lang) {
    case 'js':
    case 'javascript':
    case 'ts':
    case 'typescript':
      return getCommentPattern(['js', 'jsBlock'], magicCommentDirectives);

    case 'jsx':
    case 'tsx':
      return getCommentPattern(
        ['js', 'jsBlock', 'jsx'],
        magicCommentDirectives,
      );

    case 'html':
      return getCommentPattern(
        ['js', 'jsBlock', 'html'],
        magicCommentDirectives,
      );

    case 'python':
    case 'py':
    case 'bash':
      return getCommentPattern(['bash'], magicCommentDirectives);

    case 'markdown':
    case 'md':
      // Text uses HTML, front matter uses bash
      return getCommentPattern(['html', 'jsx', 'bash'], magicCommentDirectives);

    case 'tex':
    case 'latex':
    case 'matlab':
      return getCommentPattern(['tex'], magicCommentDirectives);

    case 'lua':
    case 'haskell':
    case 'sql':
      return getCommentPattern(['lua'], magicCommentDirectives);

    case 'wasm':
      return getCommentPattern(['wasm'], magicCommentDirectives);

    default:
      // All comment types except lua, wasm and matlab
      return getCommentPattern(
        Object.keys(commentPatterns).filter(
          (pattern) =>
            !['lua', 'wasm', 'tex', 'latex', 'matlab'].includes(pattern),
        ) as CommentType[],
        magicCommentDirectives,
      );
  }
}

export function parseCodeBlockTitle(metastring?: string): string {
  return metastring?.match(codeBlockTitleRegex)?.groups!.title ?? '';
}

export function containsLineNumbers(metastring?: string): boolean {
  return Boolean(metastring?.includes('showLineNumbers'));
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
 * If the metastring contains a range, the `content` will be returned as-is
 * without any parsing. The returned `lineClassNames` will be a map from that
 * number range to the first magic comment config entry (which _should_ be for
 * line highlight directives.)
 *
 * @param content The raw code with magic comments. Trailing newline will be
 * trimmed upfront.
 * @param options Options for parsing behavior.
 */
export function parseLines(
  content: string,
  options: {
    /**
     * The full metastring, as received from MDX. Line ranges declared here
     * start at 1.
     */
    metastring: string | undefined;
    /**
     * Language of the code block, used to determine which kinds of magic
     * comment styles to enable.
     */
    language: string | undefined;
    /**
     * Magic comment types that we should try to parse. Each entry would
     * correspond to one class name to apply to each line.
     */
    magicComments: MagicCommentConfig[];
  },
): {
  /**
   * The highlighted lines, 0-indexed. e.g. `{ 0: ["highlight", "sample"] }`
   * means the 1st line should have `highlight` and `sample` as class names.
   */
  lineClassNames: {[lineIndex: number]: string[]};
  /**
   * If there's number range declared in the metastring, the code block is
   * returned as-is (no parsing); otherwise, this is the clean code with all
   * magic comments stripped away.
   */
  code: string;
} {
  let code = content.replace(/\n$/, '');
  const {language, magicComments, metastring} = options;
  // Highlighted lines specified in props: don't parse the content
  if (metastring && metastringLinesRangeRegex.test(metastring)) {
    const linesRange = metastring.match(metastringLinesRangeRegex)!.groups!
      .range!;
    if (magicComments.length === 0) {
      throw new Error(
        `A highlight range has been given in code block's metastring (\`\`\` ${metastring}), but no magic comment config is available. Docusaurus applies the first magic comment entry's className for metastring ranges.`,
      );
    }
    const metastringRangeClassName = magicComments[0]!.className;
    const lines = rangeParser(linesRange)
      .filter((n) => n > 0)
      .map((n) => [n - 1, [metastringRangeClassName]] as [number, string[]]);
    return {lineClassNames: Object.fromEntries(lines), code};
  }
  if (language === undefined) {
    return {lineClassNames: {}, code};
  }
  const directiveRegex = getAllMagicCommentDirectiveStyles(
    language,
    magicComments,
  );
  // Go through line by line
  const lines = code.split('\n');
  const blocks = Object.fromEntries(
    magicComments.map((d) => [d.className, {start: 0, range: ''}]),
  );
  const lineToClassName: {[comment: string]: string} = Object.fromEntries(
    magicComments
      .filter((d) => d.line)
      .map(({className, line}) => [line!, className] as [string, string]),
  );
  const blockStartToClassName: {[comment: string]: string} = Object.fromEntries(
    magicComments
      .filter((d) => d.block)
      .map(({className, block}) => [block!.start, className]),
  );
  const blockEndToClassName: {[comment: string]: string} = Object.fromEntries(
    magicComments
      .filter((d) => d.block)
      .map(({className, block}) => [block!.end, className]),
  );
  for (let lineNumber = 0; lineNumber < lines.length; ) {
    const line = lines[lineNumber]!;
    const match = line.match(directiveRegex);
    if (!match) {
      // Lines without directives are unchanged
      lineNumber += 1;
      continue;
    }
    const directive = match
      .slice(1)
      .find((item: string | undefined) => item !== undefined)!;
    if (lineToClassName[directive]) {
      blocks[lineToClassName[directive]!]!.range += `${lineNumber},`;
    } else if (blockStartToClassName[directive]) {
      blocks[blockStartToClassName[directive]!]!.start = lineNumber;
    } else if (blockEndToClassName[directive]) {
      blocks[blockEndToClassName[directive]!]!.range += `${
        blocks[blockEndToClassName[directive]!]!.start
      }-${lineNumber - 1},`;
    }
    lines.splice(lineNumber, 1);
  }
  code = lines.join('\n');
  const lineClassNames: {[lineIndex: number]: string[]} = {};
  Object.entries(blocks).forEach(([className, {range}]) => {
    rangeParser(range).forEach((l) => {
      lineClassNames[l] ??= [];
      lineClassNames[l]!.push(className);
    });
  });
  return {lineClassNames, code};
}

export function getPrismCssVariables(prismTheme: PrismTheme): CSSProperties {
  const mapping: PrismThemeEntry = {
    color: '--prism-color',
    backgroundColor: '--prism-background-color',
  };

  const properties: {[key: string]: string} = {};
  Object.entries(prismTheme.plain).forEach(([key, value]) => {
    const varName = mapping[key as keyof PrismThemeEntry];
    if (varName && typeof value === 'string') {
      properties[varName] = value;
    }
  });
  return properties;
}
