/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();
const fs = require('fs-extra');
const siteConfig = require(CWD + '/siteConfig.js');
const sitemap = require('../sitemap.js');
const join = require('path').join;
const buildDir = join(CWD, 'build', siteConfig.projectName);
const { checkFile, readFile, copyFile, writeData } = require('./common');

// These don't really deserve their own files at the moment.
// Sorry small little important things that make the site work
const misc = () => {
  // create sitemap. We iterate over the MetaData, so it doesn't matter about length
  let targetFile = join(buildDir, 'sitemap.xml');
  sitemap(xml => {
    writeData(targetFile, xml);
  });

  // copy blog assets if they exist
  let assetTarget = join(CWD, 'blog', 'assets');
  let assetSource = join(buildDir, 'blog', 'assets');
  if (checkFile(assetTarget)) {
    copyFile(assetTarget, assetSource);
  }

  // Generate CNAME file if a custom domain is specified in siteConfig
  if (siteConfig.cname) {
    let targetFile = join(buildDir, 'CNAME');
    writeData(targetFile, siteConfig.cname);
  }
}

const staticFiles = require('./static.js');
const docs = require('./docs.js');
const pages = require('./pages.js');
const blog = require('./blog.js');

module.exports = { staticFiles, docs, pages, blog, misc }