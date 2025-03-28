/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {CSSProperties} from 'react';
import rangeParser from 'parse-numeric-range';
import type {PrismTheme, PrismThemeEntry} from 'prism-react-renderer';

// note: regexp/no-useless-non-capturing-group is a false positive
// the group is required or it breaks the correct alternation of
// <quote><stringValue><quote> | <rawValue>
const metaOptionRegex =
  // eslint-disable-next-line regexp/no-useless-non-capturing-group
  /(?<key>[^\s=]+)(?:=(?:(?:(?<quote>["'])(?<stringValue>.*?)\k<quote>)|(?<rawValue>\S*)))?/g;
const metastringLinesRangeRegex = /\{(?<range>[\d,-]+)\}/;

// Supported types of highlight comments
const popularCommentPatterns = {
  js: {start: '\\/\\/', end: ''},
  jsBlock: {start: '\\/\\*', end: '\\*\\/'},
  jsx: {start: '\\{\\s*\\/\\*', end: '\\*\\/\\s*\\}'},
  bash: {start: '#', end: ''},
  html: {start: '<!--', end: '-->'},
} as const;

const commentPatterns = {
  ...popularCommentPatterns, // shallow copy is sufficient
  // minor comment styles
  lua: {start: '--', end: ''},
  wasm: {start: '\\;\\;', end: ''},
  tex: {start: '%', end: ''},
  vb: {start: "['‘’]", end: ''},
  vbnet: {start: "(?:_\\s*)?['‘’]", end: ''}, // Visual Studio 2019 or later
  rem: {start: '[Rr][Ee][Mm]\\b', end: ''},
  f90: {start: '!', end: ''}, // Free format only
  ml: {start: '\\(\\*', end: '\\*\\)'},
  cobol: {start: '\\*>', end: ''}, // Free format only
} as const;

type CommentType = keyof typeof commentPatterns;
const popularCommentTypes = Object.keys(
  popularCommentPatterns,
) as CommentType[];

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
      return getCommentPattern(['lua'], magicCommentDirectives);

    case 'sql':
      return getCommentPattern(['lua', 'jsBlock'], magicCommentDirectives);

    case 'wasm':
      return getCommentPattern(['wasm'], magicCommentDirectives);

    case 'vb':
    case 'vba':
    case 'visual-basic':
      return getCommentPattern(['vb', 'rem'], magicCommentDirectives);
    case 'vbnet':
      return getCommentPattern(['vbnet', 'rem'], magicCommentDirectives);

    case 'batch':
      return getCommentPattern(['rem'], magicCommentDirectives);

    case 'basic': // https://github.com/PrismJS/prism/blob/master/components/prism-basic.js#L3
      return getCommentPattern(['rem', 'f90'], magicCommentDirectives);

    case 'fsharp':
      return getCommentPattern(['js', 'ml'], magicCommentDirectives);

    case 'ocaml':
    case 'sml':
      return getCommentPattern(['ml'], magicCommentDirectives);

    case 'fortran':
      return getCommentPattern(['f90'], magicCommentDirectives);

    case 'cobol':
      return getCommentPattern(['cobol'], magicCommentDirectives);

    default:
      // All popular comment types
      return getCommentPattern(popularCommentTypes, magicCommentDirectives);
  }
}

export function getCodeBlockTitle({
  titleProp,
  metaOptions,
}: {
  titleProp: React.ReactNode;
  metaOptions: CodeBlockMetaOptions;
}): React.ReactNode {
  // NOTE: historically the metastring option overruled
  // any `title=""` prop specified on `<CodeBlock />`
  // this is the reversed logic to getLineNumbersStart
  // but would be a breaking change so we keep it.
  return metaOptions.title || titleProp;
}

export function getLineNumbersStart({
  showLineNumbers,
  metaOptions,
}: {
  showLineNumbers: boolean | number | undefined;
  metaOptions: CodeBlockMetaOptions;
}): number | undefined {
  const showLineNumbersValue = showLineNumbers ?? metaOptions.showLineNumbers;

  const defaultStart = 1;
  if (typeof showLineNumbersValue === 'boolean') {
    return showLineNumbersValue ? defaultStart : undefined;
  }
  if (typeof showLineNumbersValue === 'number') {
    return showLineNumbersValue;
  }

  return undefined;
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

function parseMetaOptionValue(match: RegExpExecArray): CodeMetaOptionValue {
  const {stringValue, rawValue} = match.groups!;

  // flag options without values (e.g. `showLineNumbers`)
  if (stringValue === undefined && rawValue === undefined) {
    return true;
  }

  // NOTE: we currently on-purpose do not use JSON.parse here to avoid
  // parsing object literals with unclear consequences.

  // quoted string option (e.g. `title="file.ts"` or `title='file.ts'`)
  if (stringValue !== undefined) {
    return stringValue;
  }

  // boolean option (e.g. `live=true` or `showCopyButton=false`)
  if (rawValue === 'true') {
    return true;
  } else if (rawValue === 'false') {
    return false;
  }

  // number value (e.g. `showLineNumbers=10`)
  const number = parseFloat(rawValue!);
  if (!Number.isNaN(number)) {
    // number value
    return number;
  }

  // non quoted string (e.g. `live-tabMode=focus`)
  return rawValue!;
}

/**
 * Parses {@link CodeBlockParsedLines.metaOptions} from the given metastring.
 * @param metastring The metastring to parse
 * @param metaOptionsProp any meta options defined via component props.
 * @returns The parsed options.
 */
export function parseCodeBlockMetaOptions(
  metastring: string | undefined,
  metaOptionsProp: CodeBlockMetaOptions | undefined,
): CodeBlockMetaOptions {
  // If we already have options via props use them as they are
  if (metaOptionsProp) {
    return metaOptionsProp;
  }

  const parsedOptions: CodeBlockMetaOptions = {};

  if (metastring) {
    metaOptionRegex.lastIndex = 0;

    let match = metaOptionRegex.exec(metastring);

    while (match) {
      parsedOptions[match.groups!.key!] = parseMetaOptionValue(match);

      match = metaOptionRegex.exec(metastring);
    }
  }

  return parsedOptions;
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
