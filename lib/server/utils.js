/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const path = require('path');
const escapeStringRegexp = require('escape-string-regexp');

function getSubDir(file, refDir) {
  const subDir = path.dirname(path.relative(refDir, file)).replace('\\', '/');
  return subDir !== '.' && !subDir.includes('..') ? subDir : null;
}

function getLanguage(file, refDir) {
  const regexSubFolder = new RegExp(
    `${escapeStringRegexp(path.basename(refDir))}/(.*?)/.*`
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

function isSeparateCss(file, separateDirs) {
  if (!separateDirs) {
    return false;
  }
  for (let i = 0; i < separateDirs.length; i++) {
    if (file.includes(separateDirs[i])) {
      return true;
    }
  }
  return false;
}

function minifyCss(cssContent) {
  return cssnano
    .process(cssContent, {
      preset: 'default',
      zindex: false,
    })
    .then(result => result.css);
}

function autoPrefixCss(cssContent) {
  return postcss([autoprefixer])
    .process(cssContent, {
      from: undefined,
    })
    .then(result => result.css);
}

// Validate the docs in the sidebar are valid
function validateSidebar(metadata, pages) {
  if (metadata.next) {
    if (!pages[metadata.next]) {
      throw new Error(
        metadata.version
          ? `Improper sidebars file for version ${
              metadata.version
            }, document with id '${
              metadata.next
            }' not found. Make sure that all documents with ids specified in this version's sidebar file exist and that no ids are repeated.`
          : `Improper sidebars.json file, document with id '${
              metadata.next
            }' not found. Make sure that documents with the ids specified in sidebars.json exist and that no ids are repeated.`
      );
    }
  }
}

module.exports = {
  getSubDir,
  getLanguage,
  isSeparateCss,
  minifyCss,
  autoPrefixCss,
  validateSidebar,
};
