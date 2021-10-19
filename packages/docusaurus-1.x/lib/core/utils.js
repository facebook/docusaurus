/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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

function getGitLastUpdated(filepath) {
  const timestampAndAuthorRegex = /^(\d+), (.+)$/;

  function isTimestampAndAuthor(str) {
    return timestampAndAuthorRegex.test(str);
  }

  function getTimestampAndAuthor(str) {
    if (!str) {
      return null;
    }

    const temp = str.match(timestampAndAuthorRegex);
    return !temp || temp.length < 3
      ? null
      : {timestamp: temp[1], author: temp[2]};
  }

  // Wrap in try/catch in case the shell commands fail (e.g. project doesn't use Git, etc).
  try {
    // To differentiate between content change and file renaming / moving, use --summary
    // To follow the file history until before it is moved (when we create new version), use
    // --follow.
    const silentState = shell.config.silent; // Save old silent state.
    shell.config.silent = true;
    const result = shell
      .exec(`git log --follow --summary --format="%ct, %an" "${filepath}"`)
      .stdout.trim();
    shell.config.silent = silentState;

    // Format the log results to be
    // ['1234567890, Yangshun Tay', 'rename ...', '1234567880,
    //  'Joel Marcey', 'move ...', '1234567870', '1234567860']
    const records = result
      .toString('utf-8')
      .replace(/\n\s*\n/g, '\n')
      .split('\n')
      .filter(String);
    const lastContentModifierCommit = records.find((item, index, arr) => {
      const currentItemIsTimestampAndAuthor = isTimestampAndAuthor(item);
      const isLastTwoItem = index + 2 >= arr.length;
      const nextItemIsTimestampAndAuthor = isTimestampAndAuthor(arr[index + 1]);
      return (
        currentItemIsTimestampAndAuthor &&
        (isLastTwoItem || nextItemIsTimestampAndAuthor)
      );
    });

    return lastContentModifierCommit
      ? getTimestampAndAuthor(lastContentModifierCommit)
      : null;
  } catch (error) {
    console.error(error);
  }
  return null;
}

function getGitLastUpdatedTime(filepath) {
  const commit = getGitLastUpdated(filepath);

  if (commit && commit.timestamp) {
    const date = new Date(parseInt(commit.timestamp, 10) * 1000);
    return date.toLocaleDateString();
  }

  return null;
}

function getGitLastUpdatedBy(filepath) {
  const commit = getGitLastUpdated(filepath);
  return commit ? commit.author : null;
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
