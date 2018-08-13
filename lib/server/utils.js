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

function getSubDir(file, refDir) {
  const subDir = path.dirname(path.relative(refDir, file)).replace('\\', '/');
  return subDir !== '.' && !subDir.includes('..') ? subDir : null;
}

function getLanguage(file, refDir) {
  const env = require('./env.js');

  return env.translation.getLanguage(file, refDir);
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

module.exports = {
  getSubDir,
  getLanguage,
  isSeparateCss,
  minifyCss,
  autoPrefixCss,
};
