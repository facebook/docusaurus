/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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
  const subDir = path.dirname(path.relative(refDir, file)).replace(/\\/g, '/');
  return subDir !== '.' && !subDir.includes('..') ? subDir : null;
}

function getLanguage(file, refDir) {
  const separator = escapeStringRegexp(path.sep);
  const baseDir = escapeStringRegexp(path.basename(refDir));
  const regexSubFolder = new RegExp(
    `${baseDir}${separator}(.*?)${separator}.*`,
  );
  const match = regexSubFolder.exec(file);

  // Avoid misinterpreting subdirectory as language
  const env = require('./env.js');
  if (match && env.translation.enabled) {
    const enabledLanguages = env.translation
      .enabledLanguages()
      .map((language) => language.tag);
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
      from: undefined,
    })
    .then((result) => result.css);
}

function autoPrefixCss(cssContent) {
  return postcss([autoprefixer])
    .process(cssContent, {
      from: undefined,
    })
    .then((result) => result.css);
}

function replaceAssetsLink(oldContent, location) {
  let fencedBlock = false;
  const lines = oldContent.split('\n').map((line) => {
    if (line.trim().startsWith('```')) {
      fencedBlock = !fencedBlock;
    }
    return fencedBlock
      ? line
      : line.replace(/\]\(assets\//g, `](${location}/assets/`);
  });
  return lines.join('\n');
}

module.exports = {
  getSubDir,
  getLanguage,
  isSeparateCss,
  minifyCss,
  autoPrefixCss,
  replaceAssetsLink,
};
