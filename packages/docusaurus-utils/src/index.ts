/**
 * Copyright (c) 2017-present, Facebook, Inc.
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
): Promise<void> {
  const filepath = path.join(generatedFilesDir, file);
  const lastHash = fileHash.get(filepath);
  const currentHash = createHash('md5')
    .update(content)
    .digest('hex');

  if (lastHash !== currentHash) {
    await fs.ensureDir(path.dirname(filepath));
    await fs.writeFile(filepath, content);
    fileHash.set(filepath, currentHash);
  }
}

const indexRE = /(^|.*\/)index\.(md|js)$/i;
const extRE = /\.(md|js)$/;

/**
 * Convert filepath to url path. Example: 'index.md' -> '/', 'foo/bar.js' -> '/foo/bar',
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
 * Given an input string, convert to kebab-case and append a hash. Avoid str collision
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
 * Generate unique React Component Name. E.g: /foo-bar -> FooBar096
 */
export function genComponentName(pagePath: string): string {
  if (pagePath === '/') {
    return 'index';
  }
  const pageHash = docuHash(pagePath);
  const pascalCase = _.flow(
    _.camelCase,
    _.upperFirst,
  );
  return pascalCase(pageHash);
}

/**
 * Convert Windows backslash paths to posix style paths. E.g: endi\\lie -> endi/lie
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
 * Generate unique chunk name given a module path
 */
export function genChunkName(
  modulePath: string,
  prefix?: string,
  preferredName?: string,
  shortId?: boolean,
): string {
  let chunkName: string | undefined = chunkNameCache.get(modulePath);
  if (!chunkName) {
    if (shortId) {
      chunkName = _.uniqueId();
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
 * Given a filepath and dirpath, get the first directory
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
      file.excerpt = file.content
        .trim()
        .split('\n', 1)
        .shift();
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
  // Each input component is now separated by a single slash except the possible first plain protocol part.

  // remove trailing slash before parameters or hash
  str = str.replace(/\/(\?|&|#[^!])/g, '$1');

  // replace ? in parameters with &
  const parts = str.split('?');
  str = parts.shift() + (parts.length > 0 ? '?' : '') + parts.join('&');

  // dedupe forward slashes
  str = str.replace(/^\/+/, '/');

  return str;
}
