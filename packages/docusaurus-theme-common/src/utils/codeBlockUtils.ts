/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rangeParser from 'parse-numeric-range';
import type {Language} from 'prism-react-renderer';

const codeBlockTitleRegex = /title=(["'])(.*?)\1/;
const HighlightLinesRangeRegex = /{([\d,-]+)}/;

const HighlightLanguages = ['js', 'jsBlock', 'jsx', 'python', 'html'] as const;
type HighlightLanguage = typeof HighlightLanguages[number];

type HighlightLanguageConfig = {
  start: string;
  end: string;
};

// Supported types of highlight comments
const HighlightComments: Record<HighlightLanguage, HighlightLanguageConfig> = {
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

// Supported highlight directives
const HighlightDirectives = [
  'highlight-next-line',
  'highlight-start',
  'highlight-end',
  'collapse-start',
  'collapse-end',
];

const getHighlightDirectiveRegex = (
  languages: readonly HighlightLanguage[] = HighlightLanguages,
) => {
  // to be more reliable, the opening and closing comment must match
  const commentPattern = languages
    .map((lang) => {
      const {start, end} = HighlightComments[lang];
      return `(?:${start}\\s*(${HighlightDirectives.join('|')})\\s*${end})`;
    })
    .join('|');
  // white space is allowed, but otherwise it should be on it's own line
  return new RegExp(`^\\s*(?:${commentPattern})\\s*$`);
};

// select comment styles based on language
const highlightDirectiveRegex = (lang: string) => {
  switch (lang) {
    case 'js':
    case 'javascript':
    case 'ts':
    case 'typescript':
      return getHighlightDirectiveRegex(['js', 'jsBlock']);

    case 'jsx':
    case 'tsx':
      return getHighlightDirectiveRegex(['js', 'jsBlock', 'jsx']);

    case 'html':
      return getHighlightDirectiveRegex(['js', 'jsBlock', 'html']);

    case 'python':
    case 'py':
      return getHighlightDirectiveRegex(['python']);

    default:
      // all comment types
      return getHighlightDirectiveRegex();
  }
};

export function parseCodeBlockTitle(metastring?: string): string {
  return metastring?.match(codeBlockTitleRegex)?.[2] ?? '';
}

export function parseLanguage(className?: string): Language | undefined {
  const languageClassName = className
    ?.split(' ')
    .find((str) => str.startsWith('language-'));
  return languageClassName?.replace(/language-/, '') as Language | undefined;
}

export function parseLines(
  content: string,
  metastring?: string,
  language?: Language,
): {
  highlightLines: number[];
  collapsibleLines: number[];
  code: string;
} {
  let code = content.replace(/\n$/, '');
  // Highlighted lines specified in props: don't parse the content
  if (metastring && HighlightLinesRangeRegex.test(metastring)) {
    const highlightLinesRange = metastring.match(HighlightLinesRangeRegex)![1];
    const highlightLines = rangeParser(highlightLinesRange).filter(
      (n) => n > 0,
    );
    return {highlightLines, collapsibleLines: [], code};
  }
  if (language === undefined) {
    return {highlightLines: [], collapsibleLines: [], code};
  }
  const directiveRegex = highlightDirectiveRegex(language);
  // go through line by line
  const lines = code.split('\n');
  let highlightBlockStart: number;
  let highlightRange = '';
  let collapseBlockStart: number;
  let collapseRange = '';
  // loop through lines
  for (let index = 0; index < lines.length; ) {
    const line = lines[index];
    // adjust for 0-index
    const lineNumber = index + 1;
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

        case 'collapse-start':
          collapseBlockStart = lineNumber;
          break;

        case 'collapse-end':
          collapseRange += `${collapseBlockStart!}-${lineNumber - 1},`;
          break;

        default:
          break;
      }
      lines.splice(index, 1);
    } else {
      // lines without directives are unchanged
      index += 1;
    }
  }
  const highlightLines = rangeParser(highlightRange);
  const collapsibleLines = rangeParser(collapseRange);
  code = lines.join('\n');
  return {highlightLines, collapsibleLines, code};
}
