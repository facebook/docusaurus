/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const spawn = require('cross-spawn');

const execSync = require('child_process').execSync;

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
  const timeSpan = spawn
    .sync('git', ['log', '-1', '--format=%ct', filepath])
    .stdout.toString('utf-8');
  if (timeSpan) {
    const date = new Date(parseInt(timeSpan, 10) * 1000);
    return date.toLocaleString();
  }
  return null;
}

function getAuthorInformation(filepath) {
  /* set metadata author */
  const authorRegex = /(\d+) author (.+)$/g;
  const results = execSync(
    `git blame --line-porcelain ${filepath} \
    | grep -I "^author " | sort | uniq -c | sort -nr; \
  `
  ).toString().split('\n');

  const authors = [];
  let totalLineCount = 0;

  /* handle case where it's not github repo */
  if (results.length && results[0].length) {
    let authorData;
    results.forEach(result => {
      if ((authorData = authorRegex.exec(result)) !== null) {
        const lineCount = parseInt(authorData[1]);
        const name = authorData[2];
        authors.push({
          lineCount,
          name,
        });
        totalLineCount += lineCount;
      }
      authorRegex.lastIndex = 0;
    });
  }
  return { authors, totalLineCount };
}

module.exports = {
  blogPostHasTruncateMarker,
  extractBlogPostBeforeTruncate,
  getGitLastUpdated,
  getAuthorInformation,
  getPath,
  removeExtension,
  idx,
};
