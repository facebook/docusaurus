/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fm = require('front-matter');
const {createHash} = require('crypto');

const _ = require(`lodash`);
const escapeStringRegexp = require('escape-string-regexp');
const fs = require('fs-extra');

const genCache = new Map();
async function generate(generatedFilesDir, file, content) {
  const cached = genCache.get(file);
  if (cached !== content) {
    await fs.ensureDir(generatedFilesDir);
    await fs.writeFile(path.join(generatedFilesDir, file), content);
    genCache.set(file, content);
  }
}

const indexRE = /(^|.*\/)index\.(md|js)$/i;
const extRE = /\.(md|js)$/;

function fileToPath(file) {
  if (indexRE.test(file)) {
    return file.replace(indexRE, '/$1');
  }
  return `/${file.replace(extRE, '').replace(/\\/g, '/')}`;
}

function encodePath(userpath) {
  return userpath
    .split('/')
    .map(item => encodeURIComponent(item))
    .join('/');
}

/**
 * Given an input string, convert to kebab-case and append a hash. Avoid str collision
 * @param {string} str input string
 * @returns {string}
 */
function docuHash(str) {
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
 * @param {string} pagePath
 * @returns {string} unique react component name
 */
function genComponentName(pagePath) {
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
 * @param {string} str windows backslash paths
 * @returns {string} posix-style path
 */
function posixPath(str) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(str);
  const hasNonAscii = /[^\u0000-\u0080]+/.test(str); // eslint-disable-line

  if (isExtendedLengthPath || hasNonAscii) {
    return str;
  }
  return str.replace(/\\/g, '/');
}

const chunkNameCache = new Map();
function genChunkName(modulePath, prefix, preferredName) {
  let chunkName = chunkNameCache.get(modulePath);
  if (!chunkName) {
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
    chunkNameCache.set(modulePath, chunkName);
  }
  return chunkName;
}

function idx(target, keyPaths) {
  return (
    target &&
    (Array.isArray(keyPaths)
      ? keyPaths.reduce((obj, key) => obj && obj[key], target)
      : target[keyPaths])
  );
}

function getSubFolder(file, refDir) {
  const separator = escapeStringRegexp(path.sep);
  const baseDir = escapeStringRegexp(path.basename(refDir));
  const regexSubFolder = new RegExp(
    `${baseDir}${separator}(.*?)${separator}.*`,
  );
  const match = regexSubFolder.exec(file);
  return match && match[1];
}

function parse(fileString) {
  if (!fm.test(fileString)) {
    return {metadata: null, content: fileString};
  }
  const {attributes: metadata, body: content} = fm(fileString);

  return {metadata, content};
}

function normalizeUrl(rawUrls) {
  const urls = rawUrls;
  const resultArray = [];

  // If the first part is a plain protocol, we combine it with the next part.
  if (urls[0].match(/^[^/:]+:\/*$/) && urls.length > 1) {
    const first = urls.shift();
    urls[0] = first + urls[0];
  }

  // There must be two or three slashes in the file protocol, two slashes in anything else.
  if (urls[0].match(/^file:\/\/\//)) {
    urls[0] = urls[0].replace(/^([^/:]+):\/*/, '$1:///');
  } else {
    urls[0] = urls[0].replace(/^([^/:]+):\/*/, '$1://');
  }

  // eslint-disable-next-line
  for (let i = 0; i < urls.length; i++) {
    let component = urls[i];

    if (typeof component !== 'string') {
      throw new TypeError(`Url must be a string. Received ${component}`);
    }

    if (component === '') {
      // eslint-disable-next-line
      continue;
    }

    if (i > 0) {
      // Removing the starting slashes for each component but the first.
      component = component.replace(/^[/]+/, '');
    }
    if (i < urls.length - 1) {
      // Removing the ending slashes for each component but the last.
      component = component.replace(/[/]+$/, '');
    } else {
      // For the last component we will combine multiple slashes to a single one.
      component = component.replace(/[/]+$/, '/');
    }

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

module.exports = {
  encodePath,
  docuHash,
  generate,
  fileToPath,
  genComponentName,
  genChunkName,
  getSubFolder,
  idx,
  normalizeUrl,
  parse,
  posixPath,
};
