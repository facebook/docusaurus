/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rangeParser from 'parse-numeric-range';

const codeBlockTitleRegex = /title=(["'])(.*?)\1/;
const metastringLinesRangeRegex = /{([\d,-]+)}/;

const commentTypes = ['js', 'jsBlock', 'jsx', 'python', 'html'] as const;
type CommentType = typeof commentTypes[number];

type CommentPattern = {
  start: string;
  end: string;
};

export type MagicCommentConfig = {
  className: string;
  line?: string;
  block?: [string, string];
};

// Supported types of comments
const commentPatterns: Record<CommentType, CommentPattern> = {
  js: {
    start: '\\/\\/',
    end: '',
  },
  jsBlock: {
    start: '\\/\\*',
    end: '\\*\\/',
  },
  jsx: {
    start: '\\{\\s*\\/\\*',
    end: '\\*\\/\\s*\\}',
  },
  python: {
    start: '#',
    end: '',
  },
  html: {
    start: '<!--',
    end: '-->',
  },
};

const getMagicCommentDirectiveRegex = (
  magicCommentDirectives: MagicCommentConfig[],
  languages: readonly CommentType[] = commentTypes,
) => {
  // to be more reliable, the opening and closing comment must match
  const commentPattern = languages
    .map((lang) => {
      const {start, end} = commentPatterns[lang];
      return `(?:${start}\\s*(${magicCommentDirectives
        .flatMap((d) => [d.line, d.block?.[0], d.block?.[1]].filter(Boolean))
        .join('|')})\\s*${end})`;
    })
    .join('|');
  // white space is allowed, but otherwise it should be on it's own line
  return new RegExp(`^\\s*(?:${commentPattern})\\s*$`);
};

// select comment styles based on language
const magicCommentDirectiveRegex = (
  lang: string,
  magicCommentDirectives: MagicCommentConfig[],
) => {
  switch (lang) {
    case 'js':
    case 'javascript':
    case 'ts':
    case 'typescript':
      return getMagicCommentDirectiveRegex(magicCommentDirectives, [
        'js',
        'jsBlock',
      ]);

    case 'jsx':
    case 'tsx':
      return getMagicCommentDirectiveRegex(magicCommentDirectives, [
        'js',
        'jsBlock',
        'jsx',
      ]);

    case 'html':
      return getMagicCommentDirectiveRegex(magicCommentDirectives, [
        'js',
        'jsBlock',
        'html',
      ]);

    case 'python':
    case 'py':
    case 'shell':
    case 'bash':
    case 'sh':
      return getMagicCommentDirectiveRegex(magicCommentDirectives, ['python']);

    default:
      // all comment types
      return getMagicCommentDirectiveRegex(magicCommentDirectives);
  }
};

export function parseCodeBlockTitle(metastring?: string): string {
  return metastring?.match(codeBlockTitleRegex)?.[2] ?? '';
}

export function parseLanguage(className: string): string | undefined {
  const languageClassName = className
    .split(' ')
    .find((str) => str.startsWith('language-'));
  return languageClassName?.replace(/language-/, '');
}

export function parseLines(
  content: string,
  metastring: string | undefined,
  options: {
    language: string | undefined;
    magicComments: MagicCommentConfig[];
  },
): {
  /** @property lineClassNames[i] => the class names that the i-th line has; 0-indexed */
  lineClassNames: Record<number, string[]>;
  /** @property code with all magic comments removed */
  code: string;
} {
  let code = content.replace(/\n$/, '');
  const {language, magicComments} = options;
  // Highlighted lines specified in props: don't parse the content
  if (metastring && metastringLinesRangeRegex.test(metastring)) {
    const linesRange = metastring.match(metastringLinesRangeRegex)![1];
    const lines = rangeParser(linesRange)
      .filter((n) => n > 0)
      .map((n) => [n - 1, [magicComments[0].className]]);
    return {lineClassNames: Object.fromEntries(lines), code};
  }
  if (language === undefined) {
    return {lineClassNames: {}, code};
  }
  const directiveRegex = magicCommentDirectiveRegex(language, magicComments);
  // go through line by line
  const lines = code.split('\n');
  const blocks = Object.fromEntries(
    magicComments.map((d) => [d.className, {start: 0, range: ''}]),
  );
  const lineCommentToClassName: Record<string, string> = Object.fromEntries(
    magicComments
      .filter((d) => d.line)
      .map(({className, line}) => [line, className]),
  );
  const blockStartToClassName: Record<string, string> = Object.fromEntries(
    magicComments
      .filter((d) => d.block)
      .map(({className, block}) => [block![0], className]),
  );
  const blockEndToClassName: Record<string, string> = Object.fromEntries(
    magicComments
      .filter((d) => d.block)
      .map(({className, block}) => [block![1], className]),
  );
  // loop through lines
  for (let lineNumber = 0; lineNumber < lines.length; ) {
    const line = lines[lineNumber];
    const match = line.match(directiveRegex);
    if (match !== null) {
      const directive = match.slice(1).find((item) => item !== undefined)!;
      if (lineCommentToClassName[directive]) {
        blocks[lineCommentToClassName[directive]].range += `${lineNumber},`;
      } else if (blockStartToClassName[directive]) {
        blocks[blockStartToClassName[directive]].start = lineNumber;
      } else if (blockEndToClassName[directive]) {
        blocks[blockEndToClassName[directive]].range += `${
          blocks[blockEndToClassName[directive]].start
        }-${lineNumber - 1},`;
      }
      lines.splice(lineNumber, 1);
    } else {
      // lines without directives are unchanged
      lineNumber += 1;
    }
  }
  code = lines.join('\n');
  const lineClassNames: Record<number, string[]> = {};
  Object.entries(blocks).forEach(([className, {range}]) => {
    rangeParser(range).forEach((l) => {
      lineClassNames[l] ??= [];
      lineClassNames[l].push(className);
    });
  });
  return {lineClassNames, code};
}
