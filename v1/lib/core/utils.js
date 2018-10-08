/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const spawn = require('cross-spawn');

const TRUNCATE_MARKER = /<!--\s*truncate\s*-->/;

function blogPostHasTruncateMarker(content) {
  return TRUNCATE_MARKER.test(content);
}

function extractBlogPostBeforeTruncate(content) {
  return content.split(TRUNCATE_MARKER)[0];
}

function removeExtension(pathStr) {
  return pathStr.replace(/\.[^/.]+$/, '');
}

function getPath(pathStr, cleanUrl = false) {
  if (!pathStr || !cleanUrl || !pathStr.endsWith('.html')) {
    return pathStr;
  }
  return pathStr.endsWith('/index.html')
    ? pathStr.replace(/index\.html$/, '')
    : removeExtension(pathStr);
}

function idx(target, keyPaths) {
  return (
    target &&
    (Array.isArray(keyPaths)
      ? keyPaths.reduce((obj, key) => obj && obj[key], target)
      : target[keyPaths])
  );
}

function isNormalInteger(str) {
  return /^\+?(0|[1-9]\d*)$/.test(str);
}

function getGitLastUpdated(filepath) {
  // To differentiate between content change and file renaming / moving, use --summary
  // To follow the file history until before it is moved (when we create new version), use
  // --follow
  const result = spawn.sync('git', [
    'log',
    '--follow',
    '--summary',
    '--format=%ct',
    filepath,
  ]);

  // Format the log results to be ['1234567', 'rename ...', '1234566', 'move ...', '1234565', '1234564']
  const records = result.stdout
    .toString('utf-8')
    .replace(/\n\s*\n/g, '\n')
    .split('\n')
    .filter(String);

  const timeSpan = records.find(
    (item, index, arr) =>
      // The correct timeSpan will be a number which is not followed by summary meaning
      // the next element is also a number OR it is the last 2 element (since the
      // last element will always be the summary -- 'create mode ... ')
      isNormalInteger(item) &&
      (index + 2 === arr.length || isNormalInteger(arr[index + 1])),
  );
  if (timeSpan) {
    const date = new Date(parseInt(timeSpan, 10) * 1000);
    return date.toLocaleString();
  }
  return null;
}

module.exports = {
  blogPostHasTruncateMarker,
  extractBlogPostBeforeTruncate,
  getGitLastUpdated,
  getPath,
  removeExtension,
  idx,
};
