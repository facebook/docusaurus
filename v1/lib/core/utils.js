/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const shell = require('shelljs');

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

const GIT_LAST_UPDATED_TYPE = {
  TIME: 'time',
  AUTHOR: 'author',
};

function getGitLastUpdated(filepath, type) {
  if (Object.values(GIT_LAST_UPDATED_TYPE).indexOf(type) === -1) {
    return null;
  }

  // Wrap in try/catch in case the shell commands fail (e.g. project doesn't use Git, etc).
  try {
    const format = GIT_LAST_UPDATED_TYPE.TIME === type ? '%ct' : 'author=%an';
    // To differentiate between content change and file renaming / moving, use --summary
    // To follow the file history until before it is moved (when we create new version), use
    // --follow.
    const silentState = shell.config.silent; // Save old silent state.
    shell.config.silent = true;
    const result = shell
      .exec(`git log --follow --summary --format=${format} ${filepath}`)
      .stdout.trim();
    shell.config.silent = silentState;

    // Format the log results to be either
    // ['1234567', 'rename ...', '1234566', 'move ...', '1234565', '1234564']
    // OR
    // ['Yangshun Tay', 'rename ...', 'Endiliey', 'move ...', 'Joel', 'Fienny']
    const records = result
      .toString('utf-8')
      .replace(/\n\s*\n/g, '\n')
      .split('\n')
      .filter(String);
    return records;
  } catch (error) {
    console.error(error);
  }
  return null;
}
function getGitLastUpdatedTime(filepath) {
  function isTimestamp(str) {
    return /^\d+$/.test(str);
  }

  const records = getGitLastUpdated(filepath, GIT_LAST_UPDATED_TYPE.TIME);

  const timeSpan = records.find((item, index, arr) => {
    const currentItemIsTimestamp = isTimestamp(item);
    const isLastTwoItem = index + 2 >= arr.length;
    const nextItemIsTimestamp = isTimestamp(arr[index + 1]);
    return currentItemIsTimestamp && (isLastTwoItem || nextItemIsTimestamp);
  });

  if (timeSpan) {
    const date = new Date(parseInt(timeSpan, 10) * 1000);
    return date.toLocaleString();
  }
  return null;
}

function getGitLastUpdatedBy(filepath) {
  function isAuthor(str) {
    return str && str.startsWith('author=');
  }

  const records = getGitLastUpdated(filepath, GIT_LAST_UPDATED_TYPE.AUTHOR);

  const lastContentModifierAuthor = records.find((item, index, arr) => {
    const currentItemIsAuthor = isAuthor(item);
    const isLastTwoItem = index + 2 >= arr.length;
    const nextItemIsAuthor = isAuthor(arr[index + 1]);
    return currentItemIsAuthor && (isLastTwoItem || nextItemIsAuthor);
  });
  if (lastContentModifierAuthor) {
    return lastContentModifierAuthor.slice(7);
  }

  return null;
}

module.exports = {
  blogPostHasTruncateMarker,
  extractBlogPostBeforeTruncate,
  getGitLastUpdatedTime,
  getGitLastUpdatedBy,
  getPath,
  removeExtension,
  idx,
};
