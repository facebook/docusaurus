/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import matter from 'gray-matter';
import {createHash} from 'crypto';
import camelCase from 'lodash.camelcase';
import kebabCase from 'lodash.kebabcase';
import escapeStringRegexp from 'escape-string-regexp';
import fs from 'fs-extra';
import {URL} from 'url';

// @ts-expect-error: no typedefs :s
import resolvePathnameUnsafe from 'resolve-pathname';

const fileHash = new Map();
export async function generate(
  generatedFilesDir: string,
  file: string,
  content: any,
  skipCache: boolean = process.env.NODE_ENV === 'production',
): Promise<void> {
  const filepath = path.join(generatedFilesDir, file);

  if (skipCache) {
    await fs.ensureDir(path.dirname(filepath));
    await fs.writeFile(filepath, content);
    return;
  }

  let lastHash = fileHash.get(filepath);

  // If file already exists but its not in runtime cache yet,
  // we try to calculate the content hash and then compare
  // This is to avoid unnecessary overwriting and we can reuse old file.
  if (!lastHash && fs.existsSync(filepath)) {
    const lastContent = await fs.readFile(filepath, 'utf8');
    lastHash = createHash('md5').update(lastContent).digest('hex');
    fileHash.set(filepath, lastHash);
  }

  const currentHash = createHash('md5').update(content).digest('hex');

  if (lastHash !== currentHash) {
    await fs.ensureDir(path.dirname(filepath));
    await fs.writeFile(filepath, content);
    fileHash.set(filepath, currentHash);
  }
}

export function objectWithKeySorted(obj: {[index: string]: any}) {
  // https://github.com/lodash/lodash/issues/1459#issuecomment-460941233
  return Object.keys(obj)
    .sort()
    .reduce((acc: any, key: string) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

const indexRE = /(^|.*\/)index\.(md|mdx|js|jsx|ts|tsx)$/i;
const extRE = /\.(md|mdx|js|jsx|ts|tsx)$/;

/**
 * Convert filepath to url path.
 * Example: 'index.md' -> '/', 'foo/bar.js' -> '/foo/bar',
 */
export function fileToPath(file: string): string {
  if (indexRE.test(file)) {
    return file.replace(indexRE, '/$1');
  }
  return `/${file.replace(extRE, '').replace(/\\/g, '/')}`;
}

export function encodePath(userpath: string): string {
  return userpath
    .split('/')
    .map((item) => encodeURIComponent(item))
    .join('/');
}

export function simpleHash(str: string, length: number): string {
  return createHash('md5').update(str).digest('hex').substr(0, length);
}

/**
 * Given an input string, convert to kebab-case and append a hash.
 * Avoid str collision.
 */
export function docuHash(str: string): string {
  if (str === '/') {
    return 'index';
  }
  const shortHash = simpleHash(str, 3);
  return `${kebabCase(str)}-${shortHash}`;
}

/**
 * Convert first string character to the upper case.
 * E.g: docusaurus -> Docusaurus
 */
export function upperFirst(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/**
 * Generate unique React Component Name.
 * E.g: /foo-bar -> FooBar096
 */
export function genComponentName(pagePath: string): string {
  if (pagePath === '/') {
    return 'index';
  }
  const pageHash = docuHash(pagePath);
  return upperFirst(camelCase(pageHash));
}

/**
 * Convert Windows backslash paths to posix style paths.
 * E.g: endi\\lie -> endi/lie
 */
export function posixPath(str: string): string {
  const isExtendedLengthPath = /^\\\\\?\\/.test(str);
  const hasNonAscii = /[^\u0000-\u0080]+/.test(str); // eslint-disable-line

  if (isExtendedLengthPath || hasNonAscii) {
    return str;
  }
  return str.replace(/\\/g, '/');
}

const chunkNameCache = new Map();
/**
 * Generate unique chunk name given a module path.
 */
export function genChunkName(
  modulePath: string,
  prefix?: string,
  preferredName?: string,
  shortId: boolean = process.env.NODE_ENV === 'production',
): string {
  let chunkName: string | undefined = chunkNameCache.get(modulePath);
  if (!chunkName) {
    if (shortId) {
      chunkName = simpleHash(modulePath, 8);
    } else {
      let str = modulePath;
      if (preferredName) {
        const shortHash = simpleHash(modulePath, 3);
        str = `${preferredName}${shortHash}`;
      }
      const name = str === '/' ? 'index' : docuHash(str);
      chunkName = prefix ? `${prefix}---${name}` : name;
    }
    chunkNameCache.set(modulePath, chunkName);
  }
  return chunkName;
}

// Too dynamic
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function idx(target: any, keyPaths?: string | (string | number)[]): any {
  return (
    target &&
    keyPaths &&
    (Array.isArray(keyPaths)
      ? keyPaths.reduce((obj, key) => obj && obj[key], target)
      : target[keyPaths])
  );
}

/**
 * Given a filepath and dirpath, get the first directory.
 */
export function getSubFolder(file: string, refDir: string): string | null {
  const separator = escapeStringRegexp(path.sep);
  const baseDir = escapeStringRegexp(path.basename(refDir));
  const regexSubFolder = new RegExp(
    `${baseDir}${separator}(.*?)${separator}.*`,
  );
  const match = regexSubFolder.exec(file);
  return match && match[1];
}

// Regex for an import statement.
const importRegexString = '^(.*import){1}(.+){0,1}\\s[\'"](.+)[\'"];?';

export function createExcerpt(fileString: string): string | undefined {
  let fileContent = fileString.trimLeft();

  if (RegExp(importRegexString).test(fileContent)) {
    fileContent = fileContent
      .replace(RegExp(importRegexString, 'gm'), '')
      .trimLeft();
  }

  const fileLines = fileContent.split('\n');

  for (const fileLine of fileLines) {
    const cleanedLine = fileLine
      // Remove HTML tags.
      .replace(/<[^>]*>/g, '')
      // Remove ATX-style headers.
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

type ParsedMarkdown = {
  frontMatter: {
    // Returned by gray-matter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  content: string;
  excerpt: string | undefined;
};
export function parseMarkdownString(markdownString: string): ParsedMarkdown {
  const options: Record<string, unknown> = {
    excerpt: (file: matter.GrayMatterFile<string>): void => {
      // Hacky way of stripping out import statements from the excerpt
      // TODO: Find a better way to do so, possibly by compiling the Markdown content,
      // stripping out HTML tags and obtaining the first line.
      file.excerpt = createExcerpt(file.content);
    },
  };

  try {
    const {data: frontMatter, content, excerpt} = matter(
      markdownString,
      options,
    );
    return {frontMatter, content, excerpt};
  } catch (e) {
    throw new Error(`Error while parsing markdown front matter.
This can happen if you use special characteres like : in frontmatter values (try using "" around that value)
${e.message}`);
  }
}

export async function parseMarkdownFile(
  source: string,
): Promise<ParsedMarkdown> {
  const markdownString = await fs.readFile(source, 'utf-8');
  try {
    return parseMarkdownString(markdownString);
  } catch (e) {
    throw new Error(
      `Error while parsing markdown file ${source}
${e.message}`,
    );
  }
}

export function normalizeUrl(rawUrls: string[]): string {
  const urls = rawUrls;
  const resultArray = [];

  let hasStartingSlash = false;
  let hasEndingSlash = false;

  // If the first part is a plain protocol, we combine it with the next part.
  if (urls[0].match(/^[^/:]+:\/*$/) && urls.length > 1) {
    const first = urls.shift();
    urls[0] = first + urls[0];
  }

  // There must be two or three slashes in the file protocol,
  // two slashes in anything else.
  const replacement = urls[0].match(/^file:\/\/\//) ? '$1:///' : '$1://';
  urls[0] = urls[0].replace(/^([^/:]+):\/*/, replacement);

  // eslint-disable-next-line
  for (let i = 0; i < urls.length; i++) {
    let component = urls[i];

    if (typeof component !== 'string') {
      throw new TypeError(`Url must be a string. Received ${typeof component}`);
    }

    if (component === '') {
      if (i === urls.length - 1 && hasEndingSlash) {
        resultArray.push('/');
      }
      // eslint-disable-next-line
      continue;
    }

    if (component !== '/') {
      if (i > 0) {
        // Removing the starting slashes for each component but the first.
        component = component.replace(
          /^[/]+/,
          // Special case where the first element of rawUrls is empty ["", "/hello"] => /hello
          component[0] === '/' && !hasStartingSlash ? '/' : '',
        );
      }

      hasEndingSlash = component[component.length - 1] === '/';
      // Removing the ending slashes for each component but the last.
      // For the last component we will combine multiple slashes to a single one.
      component = component.replace(/[/]+$/, i < urls.length - 1 ? '' : '/');
    }

    hasStartingSlash = true;
    resultArray.push(component);
  }

  let str = resultArray.join('/');
  // Each input component is now separated by a single slash
  // except the possible first plain protocol part.

  // Remove trailing slash before parameters or hash.
  str = str.replace(/\/(\?|&|#[^!])/g, '$1');

  // Replace ? in parameters with &.
  const parts = str.split('?');
  str = parts.shift() + (parts.length > 0 ? '?' : '') + parts.join('&');

  // Dedupe forward slashes in the entire path, avoiding protocol slashes.
  str = str.replace(/([^:]\/)\/+/g, '$1');

  // Dedupe forward slashes at the beginning of the path.
  str = str.replace(/^\/+/g, '/');

  return str;
}

/**
 * Alias filepath relative to site directory, very useful so that we
 * don't expose user's site structure.
 * Example: some/path/to/website/docs/foo.md -> @site/docs/foo.md
 */
export function aliasedSitePath(filePath: string, siteDir: string): string {
  const relativePath = path.relative(siteDir, filePath);
  // Cannot use path.join() as it resolves '../' and removes
  // the '@site'. Let webpack loader resolve it.
  return `@site/${relativePath}`;
}

export function getEditUrl(
  fileRelativePath: string,
  editUrl?: string,
): string | undefined {
  return editUrl
    ? normalizeUrl([editUrl, posixPath(fileRelativePath)])
    : undefined;
}

export function isValidPathname(str: string): boolean {
  if (!str.startsWith('/')) {
    return false;
  }
  try {
    // weird, but is there a better way?
    const parsedPathname = new URL(str, 'https://domain.com').pathname;
    return parsedPathname === str || parsedPathname === encodeURI(str);
  } catch (e) {
    return false;
  }
}

// resolve pathname and fail fast if resolution fails
export function resolvePathname(to: string, from?: string) {
  return resolvePathnameUnsafe(to, from);
}
export function addLeadingSlash(str: string): string {
  return str.startsWith('/') ? str : `/${str}`;
}
export function addTrailingSlash(str: string): string {
  return str.endsWith('/') ? str : `${str}/`;
}

export function removeTrailingSlash(str: string): string {
  return removeSuffix(str, '/');
}

export function removeSuffix(str: string, suffix: string): string {
  if (suffix === '') {
    return str; // always returns "" otherwise!
  }
  return str.endsWith(suffix) ? str.slice(0, -suffix.length) : str;
}

export function removePrefix(str: string, prefix: string): string {
  return str.startsWith(prefix) ? str.slice(prefix.length) : str;
}

export function getFilePathForRoutePath(routePath: string): string {
  const fileName = path.basename(routePath);
  const filePath = path.dirname(routePath);
  return path.join(filePath, `${fileName}/index.html`);
}

export function getElementsAround<T extends unknown>(
  array: T[],
  aroundIndex: number,
): {
  next: T | undefined;
  previous: T | undefined;
} {
  const min = 0;
  const max = array.length - 1;
  if (aroundIndex < min || aroundIndex > max) {
    throw new Error(
      `Valid aroundIndex for array (of size ${array.length}) are between ${min} and ${max}, but you provided aroundIndex=${aroundIndex}`,
    );
  }
  const previous = aroundIndex === min ? undefined : array[aroundIndex - 1];
  const next = aroundIndex === max ? undefined : array[aroundIndex + 1];
  return {previous, next};
}

export function getPluginI18nPath({
  siteDir,
  currentLocale,
  pluginFolderName,
  pluginId,
  subPaths = [],
}: {
  siteDir: string;
  currentLocale: string;
  pluginFolderName: string;
  pluginId: string;
  subPaths?: string[];
}) {
  return path.join(
    siteDir,
    'i18n',
    // namespace first by locale: convenient to work in a single folder for a translator
    currentLocale,
    // Make it convenient to use for single-instance
    // ie: return "docs", no "docs-default" nor "docs/default"
    `${pluginFolderName}${
      // TODO duplicate constant :(
      pluginId === 'default' ? '' : `-${pluginId}`
    }`,
    ...subPaths,
  );
}

export async function mapAsyncSequencial<T extends unknown, R extends unknown>(
  array: T[],
  action: (t: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (const t of array) {
    // eslint-disable-next-line no-await-in-loop
    const result = await action(t);
    results.push(result);
  }
  return results;
}

export async function findAsyncSequential<T>(
  array: T[],
  predicate: (t: T) => Promise<boolean>,
): Promise<T | undefined> {
  for (const t of array) {
    // eslint-disable-next-line no-await-in-loop
    if (await predicate(t)) {
      return t;
    }
  }
  return undefined;
}

export async function getFolderContainingFile(
  folderPaths: string[],
  relativeFilePath: string,
): Promise<string> {
  const maybeFolderPath = await findAsyncSequential(folderPaths, (folderPath) =>
    fs.pathExists(path.join(folderPath, relativeFilePath)),
  );
  // should never happen, as the source was read from the FS anyway...
  if (!maybeFolderPath) {
    throw new Error(
      `relativeFilePath=[${relativeFilePath}] does not exist in any of these folders: \n- ${folderPaths.join(
        '\n- ',
      )}]`,
    );
  }
  return maybeFolderPath;
}
