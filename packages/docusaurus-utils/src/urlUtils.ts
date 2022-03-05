/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {removeSuffix} from './jsUtils';
import resolvePathnameUnsafe from 'resolve-pathname';

export function normalizeUrl(rawUrls: string[]): string {
  const urls = [...rawUrls];
  const resultArray = [];

  let hasStartingSlash = false;
  let hasEndingSlash = false;

  // If the first part is a plain protocol, we combine it with the next part.
  if (urls[0].match(/^[^/:]+:\/*$/) && urls.length > 1) {
    const first = urls.shift();
    if (first!.startsWith('file:') && urls[0].startsWith('/')) {
      // Force a double slash here, else we lose the information that the next
      // segment is an absolute path
      urls[0] = `${first}//${urls[0]}`;
    } else {
      urls[0] = first + urls[0];
    }
  }

  // There must be two or three slashes in the file protocol,
  // two slashes in anything else.
  const replacement = urls[0].match(/^file:\/\/\//) ? '$1:///' : '$1://';
  urls[0] = urls[0].replace(/^(?<protocol>[^/:]+):\/*/, replacement);

  for (let i = 0; i < urls.length; i += 1) {
    let component = urls[i];

    if (typeof component !== 'string') {
      throw new TypeError(`Url must be a string. Received ${typeof component}`);
    }

    if (component === '') {
      if (i === urls.length - 1 && hasEndingSlash) {
        resultArray.push('/');
      }
      // eslint-disable-next-line no-continue
      continue;
    }

    if (component !== '/') {
      if (i > 0) {
        // Removing the starting slashes for each component but the first.
        component = component.replace(
          /^[/]+/,
          // Special case where the first element of rawUrls is empty
          // ["", "/hello"] => /hello
          component[0] === '/' && !hasStartingSlash ? '/' : '',
        );
      }

      hasEndingSlash = component[component.length - 1] === '/';
      // Removing the ending slashes for each component but the last. For the
      // last component we will combine multiple slashes to a single one.
      component = component.replace(/[/]+$/, i < urls.length - 1 ? '' : '/');
    }

    hasStartingSlash = true;
    resultArray.push(component);
  }

  let str = resultArray.join('/');
  // Each input component is now separated by a single slash
  // except the possible first plain protocol part.

  // Remove trailing slash before parameters or hash.
  str = str.replace(/\/(?<search>\?|&|#[^!])/g, '$1');

  // Replace ? in parameters with &.
  const parts = str.split('?');
  str = parts.shift() + (parts.length > 0 ? '?' : '') + parts.join('&');

  // Dedupe forward slashes in the entire path, avoiding protocol slashes.
  str = str.replace(/(?<textBefore>[^:/]\/)\/+/g, '$1');

  // Dedupe forward slashes at the beginning of the path.
  str = str.replace(/^\/+/g, '/');

  return str;
}

export function getEditUrl(
  fileRelativePath: string,
  editUrl?: string,
): string | undefined {
  return editUrl
    ? // Don't use posixPath for this: we need to force a forward slash path
      normalizeUrl([editUrl, fileRelativePath.replace(/\\/g, '/')])
    : undefined;
}

/**
 * Convert filepath to url path.
 * Example: 'index.md' -> '/', 'foo/bar.js' -> '/foo/bar',
 */
export function fileToPath(file: string): string {
  const indexRE = /(?<dirname>^|.*\/)index\.(?:mdx?|jsx?|tsx?)$/i;
  const extRE = /\.(?:mdx?|jsx?|tsx?)$/;

  if (indexRE.test(file)) {
    return file.replace(indexRE, '/$1');
  }
  return `/${file.replace(extRE, '').replace(/\\/g, '/')}`;
}

export function encodePath(userPath: string): string {
  return userPath
    .split('/')
    .map((item) => encodeURIComponent(item))
    .join('/');
}

export function isValidPathname(str: string): boolean {
  if (!str.startsWith('/')) {
    return false;
  }
  try {
    // weird, but is there a better way?
    const parsedPathname = new URL(str, 'https://domain.com').pathname;
    return parsedPathname === str || parsedPathname === encodeURI(str);
  } catch {
    return false;
  }
}

// resolve pathname and fail fast if resolution fails
export function resolvePathname(to: string, from?: string): string {
  return resolvePathnameUnsafe(to, from);
}
export function addLeadingSlash(str: string): string {
  return str.startsWith('/') ? str : `/${str}`;
}

// TODO deduplicate: also present in @docusaurus/utils-common
export function addTrailingSlash(str: string): string {
  return str.endsWith('/') ? str : `${str}/`;
}
export function removeTrailingSlash(str: string): string {
  return removeSuffix(str, '/');
}
