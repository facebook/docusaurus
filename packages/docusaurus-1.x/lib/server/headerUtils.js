#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');
const metadataUtils = require('./metadataUtils.js');

// generate a doc header from metadata
function makeHeader(metadata) {
  let header = '---\n';
  Object.keys(metadata).forEach(key => {
    header += `${key}: ${metadata[key]}\n`;
  });
  header += '---\n';
  return header;
}

// rewriteHeaders rewrites all headers of markdown files under `filePath`
// changing `fromVersion` to `toVersion`
function rewriteHeaders(filePath, fromVersion, toVersion) {
  const files = glob.sync(`${filePath}/*`);
  files.forEach(file => {
    const stats = fs.lstatSync(file);
    if (stats.isDirectory()) {
      rewriteHeaders(file, fromVersion, toVersion);
      return;
    }
    const extension = path.extname(file);
    if (extension !== '.md' && extension !== '.markdown') {
      return;
    }
    const res = metadataUtils.extractMetadata(fs.readFileSync(file, 'utf8'));
    const metadata = res.metadata;
    const rawContent = res.rawContent;
    if (!metadata.id) {
      return;
    }
    metadata.id = metadata.id.replace(
      `version-${fromVersion}-`,
      `version-${toVersion}-`,
    );
    fs.writeFileSync(file, makeHeader(metadata) + rawContent);
  });
}

module.exports = {
  makeHeader,
  rewriteHeaders,
};
