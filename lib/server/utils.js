/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const path = require('path');
const escapeStringRegexp = require('escape-string-regexp');
const fs = require('fs-extra');
const glob = require('glob');
const crypto = require('crypto');

// Return the subdirectory path from a reference directory
// Example:
//  (file: 'docs/projectA/test.md', refDir: 'docs')
//  returns 'projectA'
function getSubDir(file, refDir) {
  let subDir = path.dirname(path.relative(refDir, file));
  subDir = subDir.replace('\\', '/');
  return subDir !== '.' ? subDir : null;
}

// Get the corresponding enabled language locale of a file.
// Example:
//  (file: '/website/translated_docs/ko/projectA/test.md', refDir: 'website/translated_docs')
//  returns 'ko'
function getLanguage(file, refDir) {
  let regexSubFolder = new RegExp(
    '/' + escapeStringRegexp(path.basename(refDir)) + '/(.*)/.*/'
  );
  const match = regexSubFolder.exec(file);

  // Avoid misinterpreting subdirectory as language
  const env = require('./env.js');
  if (match && env.translation.enabled) {
    const enabledLanguages = env.translation
      .enabledLanguages()
      .map(language => language.tag);
    if (enabledLanguages.indexOf(match[1]) !== -1) {
      return match[1];
    }
  }
  return null;
}

// create hash based on css content from static folder
function fingerprintCss(cssPath) {
  let cssForHashing = fs.readFileSync(
    path.join(__dirname, '../static/css', 'main.css')
  );
  glob.sync(cssPath).forEach(file => {
    const normalizedFile = path.normalize(file);
    cssForHashing += fs.readFileSync(normalizedFile, 'utf8');
  });
  return crypto
    .createHash('sha1')
    .update(cssForHashing, 'utf8')
    .digest('hex');
}

module.exports = {
  getSubDir,
  getLanguage,
  fingerprintCss,
};
