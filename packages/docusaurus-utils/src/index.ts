/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import matter from 'gray-matter';
import {createHash} from 'crypto';
import _ from 'lodash';
import escapeStringRegexp from 'escape-string-regexp';
import fs from 'fs-extra';

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
    lastHash = createHash('md5')
      .update(lastContent)
      .digest('hex');
    fileHash.set(filepath, lastHash);
  }

  const currentHash = createHash('md5')
    .update(content)
    .digest('hex');

  if (lastHash !== currentHash) {
    await fs.ensureDir(path.dirname(filepath));
    await fs.writeFile(filepath, content);
    fileHash.set(filepath, currentHash);
  }
}

export function objectWithKeySorted(obj: Object) {
  // https://github.com/lodash/lodash/issues/1459#issuecomment-253969771
  return _(obj)
    .toPairs()
    .sortBy(0)
    .fromPairs()
    .value();
}

const indexRE = /(^|.*\/)index\.(md|js|jsx|ts|tsx)$/i;
const extRE = /\.(md|js|tsx)$/;

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
    .map(item => encodeURIComponent(item))
    .join('/');
}

/**
 * Given an input string, convert to kebab-case and append a hash.
 * Avoid str collision.
 */
export function docuHash(str: string): string {
  if (str === '/') {
    return 'index';
  }
  const shortHash = createHash('md5')
    .update(str)
    .digest('hex')
    .substr(0, 3);
  return `${_.kebabCase(str)}-${shortHash}`;
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
  const pascalCase = _.flow(_.camelCase, _.upperFirst);
  return pascalCase(pageHash);
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
      chunkName = createHash('md5')
        .update(modulePath)
        .digest('hex')
        .substr(0, 8);
    } else {
      let str = modulePath;
      if (preferredName) {
        const shortHash = createHash('md5')
          .update(modulePath)
          .digest('hex')
          .substr(0, 3);
        str = `${preferredName}${shortHash}`;
      }
      const name = str === '/' ? 'index' : docuHash(str);
      chunkName = prefix ? `${prefix}---${name}` : name;
    }
    chunkNameCache.set(modulePath, chunkName);
  }
  return chunkName;
}

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

const importRegexString = '^(.*import){1}(.+){0,1}\\s[\'"](.+)[\'"];';

export function parse(
  fileString: string,
): {
  frontMatter: {
    [key: string]: any;
  };
  content: string;
  excerpt: string | undefined;
} {
  const options: {} = {
    excerpt: (file: matter.GrayMatterFile<string>): void => {
      let fileContent = file.content.trimLeft();

      if (RegExp(importRegexString).test(fileContent)) {
        fileContent = fileContent
          .replace(RegExp(importRegexString, 'gm'), '')
          .trimLeft();
      }

      file.excerpt = fileContent.split('\n', 1).shift();
    },
  };

  const {data: frontMatter, content, excerpt} = matter(fileString, options);
  return {frontMatter, content, excerpt};
}

export function normalizeUrl(rawUrls: string[]): string {
  const urls = rawUrls;
  const resultArray = [];

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
      // eslint-disable-next-line
      continue;
    }

    if (i > 0) {
      // Removing the starting slashes for each component but the first.
      component = component.replace(/^[/]+/, '');
    }

    // Removing the ending slashes for each component but the last.
    // For the last component we will combine multiple slashes to a single one.
    component = component.replace(/[/]+$/, i < urls.length - 1 ? '' : '/');

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

  // Dedupe forward slashes.
  str = str.replace(/^\/+/, '/');

  return str;
}

/**
 * Alias filepath relative to site directory, very useful so that we
 * don't expose user's site structure.
 * Example: some/path/to/website/docs/foo.md -> @site/docs/foo.md
 */
export function aliasedSitePath(filePath: string, siteDir: string) {
  const relativePath = path.relative(siteDir, filePath);
  // Cannot use path.join() as it resolves '../' and removes
  // the '@site'. Let webpack loader resolve it.
  return `@site/${relativePath}`;
}
