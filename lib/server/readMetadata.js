/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();

const path = require('path');
const fs = require('fs');
const glob = require('glob');

const DocsMetadata = require('./metadata/DocsMetadata');

const env = require('./env.js');
const blog = require('./blog.js');

const siteConfig = require(`${CWD}/siteConfig.js`);
const versionFallback = require('./versionFallback.js');

// Can have a custom docs path. Top level folder still needs to be in directory
// at the same level as `website`, not inside `website`.
//   e.g., docs/whereDocsReallyExist
//         website-docs/
// All .md docs still (currently) must be in one flat directory hierarchy.
//   e.g., docs/whereDocsReallyExist/*.md (all .md files in this dir)
function getDocsPath() {
  return siteConfig.customDocsPath ? siteConfig.customDocsPath : 'docs';
}

let docsMetadataInstance;

function getDocsMetaData() {
  if (!docsMetadataInstance) {
    const docsDir = path.join(CWD, '../', getDocsPath());
    const translatedDir = path.join(CWD, 'translated_docs');
    let sidebars;

    if (fs.existsSync(`${CWD}/sidebars.json`)) {
      sidebars = require(`${CWD}/sidebars.json`);
    } else {
      sidebars = {};
    }

    try {
      docsMetadataInstance = new DocsMetadata({
        docsDir,
        translatedDir,
        versionFallback,
        sidebars,
        translation: env.translation,
        versioning: env.versioning,
        useEnglishUrl: siteConfig.useEnglishUrl,
      });
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  return docsMetadataInstance;
}

function processMetadata(...args) {
  const docsMetadata = getDocsMetaData();

  return docsMetadata.processMetadata(...args);
}

// process metadata for all docs and save into core/metadata.js
function generateMetadataDocs() {
  const docsMetadata = getDocsMetaData();

  const metadatas = docsMetadata.populate();

  fs.writeFileSync(
    path.join(__dirname, '/../core/metadata.js'),
    `${'/**\n' +
    ' * @' +
    'generated\n' + // separate this out for Nuclide treating @generated as readonly
      ' */\n' +
      'module.exports = '}${JSON.stringify(metadatas, null, 2)};\n`
  );
}

// process metadata for blog posts and save into core/MetadataBlog.js
function generateMetadataBlog() {
  const metadatas = [];

  const files = glob.sync(`${CWD}/blog/**/*.*`);
  files
    .sort()
    .reverse()
    .forEach(file => {
      const extension = path.extname(file);
      if (extension !== '.md' && extension !== '.markdown') {
        return;
      }
      const metadata = blog.getMetadata(file);
      // Extract, YYYY, MM, DD from the file name
      const filePathDateArr = path
        .basename(file)
        .toString()
        .split('-');
      metadata.date = new Date(
        `${filePathDateArr[0]}-${filePathDateArr[1]}-${
          filePathDateArr[2]
        }T06:00:00.000Z`
      );
      // allow easier sorting of blog by providing seconds since epoch
      metadata.seconds = Math.round(metadata.date.getTime() / 1000);

      metadatas.push(metadata);
    });

  const sortedMetadatas = metadatas.sort(
    (a, b) => parseInt(b.seconds, 10) - parseInt(a.seconds, 10)
  );

  fs.writeFileSync(
    path.join(__dirname, '/../core/MetadataBlog.js'),
    `${'/**\n' +
    ' * @' +
    'generated\n' + // separate this out for Nuclide treating @generated as readonly
      ' */\n' +
      'module.exports = '}${JSON.stringify(sortedMetadatas, null, 2)};\n`
  );
}

module.exports = {
  getDocsPath,
  processMetadata,
  generateMetadataDocs,
  generateMetadataBlog,
};
