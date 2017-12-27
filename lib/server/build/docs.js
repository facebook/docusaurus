/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();
const render = require('../render');
const env = require('../env.js');
const siteConfig = require(CWD + '/siteConfig');
const path = require('path');
const join = path.join;
const buildDir = join(CWD, 'build', siteConfig.projectName);
const readMetadata = require('../readMetadata.js');
const {copyFile, writeData, readFile, checkFile} = require('./common');

const buildDocs = () => {
  console.log('Creating documentation...');

  let possibleRedirects = [];

  readMetadata.generateMetadataDocs();
  const Metadata = require('../../core/metadata.js');

  // mdToHtml is a map from a markdown file name to its html link, used to
  // change relative markdown links that work on GitHub into actual site links
  const mdToHtml = render.doc.mdToHtml(Metadata);

  // We go off the metadata the same way the live site does
  Object.keys(Metadata).forEach(id => {
    let metadata = Metadata[id];
    let permalink = metadata.permalink;

    let rawHtml = render.doc.renderDoc(metadata, mdToHtml);
    const targetFile = join(buildDir, permalink);

    // HACKY!!
    // Special behavour to pass unit tests and legacy sites
    if (
      metadata.language === 'en' &&
      (siteConfig.useEnglishUrl || env.translation.enabled)
    ) {
      let unprefixed = targetFile.replace('en' + path.sep, '');
      var redirect = render.redirect('../' + metadata.permalink, undefined);
      writeData(unprefixed, redirect);
    }

    writeData(targetFile, rawHtml);
  });

  var assetSource = join(CWD, '..', readMetadata.getDocsPath(), 'assets');

  // copy docs assets if they exist
  if (checkFile(assetSource)) {
    let assetDestination = join(buildDir, 'docs', 'assets');
    copyFile(assetSource, assetDestination);
  }
};

module.exports = buildDocs;
