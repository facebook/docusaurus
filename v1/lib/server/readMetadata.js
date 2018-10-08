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

const metadataUtils = require('./metadataUtils');

const env = require('./env.js');
const blog = require('./blog.js');

const siteConfig = require(`${CWD}/siteConfig.js`);
const versionFallback = require('./versionFallback.js');
const utils = require('./utils.js');

const SupportedHeaderFields = new Set([
  'id',
  'title',
  'author',
  'authorURL',
  'authorFBID',
  'sidebar_label',
  'original_id',
  'hide_title',
  'layout',
  'custom_edit_url',
]);

let allSidebars;
if (fs.existsSync(`${CWD}/sidebars.json`)) {
  allSidebars = require(`${CWD}/sidebars.json`);
} else {
  allSidebars = {};
}

// Can have a custom docs path. Top level folder still needs to be in directory
// at the same level as `website`, not inside `website`.
//   e.g., docs/whereDocsReallyExist
//         website-docs/
// All .md docs still (currently) must be in one flat directory hierarchy.
//   e.g., docs/whereDocsReallyExist/*.md (all .md files in this dir)
function getDocsPath() {
  return siteConfig.customDocsPath ? siteConfig.customDocsPath : 'docs';
}

// returns map from id to object containing sidebar ordering info
function readSidebar(sidebars = {}) {
  Object.assign(sidebars, versionFallback.sidebarData());

  const order = {};

  Object.keys(sidebars).forEach(sidebar => {
    const categories = sidebars[sidebar];

    let ids = [];
    const categoryOrder = [];
    const subCategoryOrder = [];
    Object.keys(categories).forEach(category => {
      if (Array.isArray(categories[category])) {
        ids = ids.concat(categories[category]);

        for (let i = 0; i < categories[category].length; i++) {
          categoryOrder.push(category);
          subCategoryOrder.push(undefined);
        }
      } else {
        Object.keys(categories[category]).forEach(subCategory => {
          ids = ids.concat(categories[category][subCategory]);

          for (let i = 0; i < categories[category][subCategory].length; i++) {
            categoryOrder.push(category);
            subCategoryOrder.push(subCategory);
          }
        });
      }
    });

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let previous;
      let next;

      if (i > 0) previous = ids[i - 1];

      if (i < ids.length - 1) next = ids[i + 1];

      order[id] = {
        previous,
        next,
        sidebar,
        category: categoryOrder[i],
        sub_category: subCategoryOrder[i],
        sort: i + 1,
      };
    }
  });

  return order;
}

// process the metadata for a document found in either 'docs' or 'translated_docs'
function processMetadata(file, refDir) {
  const result = metadataUtils.extractMetadata(fs.readFileSync(file, 'utf8'));
  const language = utils.getLanguage(file, refDir) || 'en';

  const metadata = {};
  Object.keys(result.metadata).forEach(fieldName => {
    if (SupportedHeaderFields.has(fieldName)) {
      metadata[fieldName] = result.metadata[fieldName];
    } else {
      console.warn(`Header field "${fieldName}" in ${file} is not supported.`);
    }
  });

  const rawContent = result.rawContent;

  if (!metadata.id) {
    metadata.id = path.basename(file, path.extname(file));
  }
  if (metadata.id.includes('/')) {
    throw new Error('Document id cannot include "/".');
  }

  // If a file is located in a subdirectory, prepend the subdir to it's ID
  // Example:
  //  (file: 'docusaurus/docs/projectA/test.md', ID 'test', refDir: 'docusaurus/docs')
  //  returns 'projectA/test'
  const subDir = utils.getSubDir(file, refDir);
  if (subDir) {
    metadata.id = `${subDir}/${metadata.id}`;
  }

  // Example: `docs/projectA/test.md` source is `projectA/test.md`
  metadata.source = subDir
    ? `${subDir}/${path.basename(file)}`
    : path.basename(file);

  if (!metadata.title) {
    metadata.title = metadata.id;
  }

  const langPart =
    env.translation.enabled || siteConfig.useEnglishUrl ? `${language}/` : '';
  let versionPart = '';
  if (env.versioning.enabled) {
    metadata.version = 'next';
    versionPart = 'next/';
  }

  metadata.permalink = `docs/${langPart}${versionPart}${metadata.id}.html`;

  // change ids previous, next
  metadata.localized_id = metadata.id;
  metadata.id = (env.translation.enabled ? `${language}-` : '') + metadata.id;
  metadata.language = env.translation.enabled ? language : 'en';

  const order = readSidebar(allSidebars);
  const id = metadata.localized_id;

  if (order[id]) {
    metadata.sidebar = order[id].sidebar;
    metadata.category = order[id].category;
    metadata.sub_category = order[id].sub_category;
    metadata.sort = order[id].sort;

    if (order[id].next) {
      metadata.next_id = order[id].next;
      metadata.next =
        (env.translation.enabled ? `${language}-` : '') + order[id].next;
    }
    if (order[id].previous) {
      metadata.previous_id = order[id].previous;
      metadata.previous =
        (env.translation.enabled ? `${language}-` : '') + order[id].previous;
    }
  }

  return {metadata, rawContent};
}

// process metadata for all docs and save into core/metadata.js
function generateMetadataDocs() {
  let order;
  try {
    order = readSidebar(allSidebars);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  const enabledLanguages = env.translation
    .enabledLanguages()
    .map(language => language.tag);

  const metadatas = {};
  const defaultMetadatas = {};

  // metadata for english files
  const docsDir = path.join(CWD, '../', getDocsPath());
  let files = glob.sync(`${docsDir}/**`);
  files.forEach(file => {
    const extension = path.extname(file);

    if (extension === '.md' || extension === '.markdown') {
      const res = processMetadata(file, docsDir);

      if (!res) {
        return;
      }
      const metadata = res.metadata;
      metadatas[metadata.id] = metadata;

      // create a default list of documents for each enabled language based on docs in English
      // these will get replaced if/when the localized file is downloaded from crowdin
      enabledLanguages
        .filter(currentLanguage => currentLanguage !== 'en')
        .forEach(currentLanguage => {
          const baseMetadata = Object.assign({}, metadata);
          baseMetadata.id = baseMetadata.id
            .toString()
            .replace(/^en-/, `${currentLanguage}-`);
          if (baseMetadata.permalink)
            baseMetadata.permalink = baseMetadata.permalink
              .toString()
              .replace(/^docs\/en\//, `docs/${currentLanguage}/`);
          if (baseMetadata.next)
            baseMetadata.next = baseMetadata.next
              .toString()
              .replace(/^en-/, `${currentLanguage}-`);
          if (baseMetadata.previous)
            baseMetadata.previous = baseMetadata.previous
              .toString()
              .replace(/^en-/, `${currentLanguage}-`);
          baseMetadata.language = currentLanguage;
          defaultMetadatas[baseMetadata.id] = baseMetadata;
        });
      Object.assign(metadatas, defaultMetadatas);
    }
  });

  // metadata for non-english docs
  const translatedDir = path.join(CWD, 'translated_docs');
  files = glob.sync(`${CWD}/translated_docs/**`);
  files.forEach(file => {
    if (!utils.getLanguage(file, translatedDir)) {
      return;
    }

    const extension = path.extname(file);

    if (extension === '.md' || extension === '.markdown') {
      const res = processMetadata(file, translatedDir);
      if (!res) {
        return;
      }
      const metadata = res.metadata;
      metadatas[metadata.id] = metadata;
    }
  });

  // metadata for versioned docs
  const versionData = versionFallback.docData();
  versionData.forEach(metadata => {
    const id = metadata.localized_id;
    if (order[id]) {
      metadata.sidebar = order[id].sidebar;
      metadata.category = order[id].category;
      metadata.sub_category = order[id].sub_category;
      metadata.sort = order[id].sort;

      if (order[id].next) {
        metadata.next_id = order[id].next.replace(
          `version-${metadata.version}-`,
          '',
        );
        metadata.next =
          (env.translation.enabled ? `${metadata.language}-` : '') +
          order[id].next;
      }
      if (order[id].previous) {
        metadata.previous_id = order[id].previous.replace(
          `version-${metadata.version}-`,
          '',
        );
        metadata.previous =
          (env.translation.enabled ? `${metadata.language}-` : '') +
          order[id].previous;
      }
    }
    metadatas[metadata.id] = metadata;
  });

  // Get the titles of the previous and next ids so that we can use them in
  // navigation buttons in DocsLayout.js
  Object.keys(metadatas).forEach(metadata => {
    if (metadatas[metadata].previous) {
      if (metadatas[metadatas[metadata].previous]) {
        metadatas[metadata].previous_title =
          metadatas[metadatas[metadata].previous].title;
      } else {
        metadatas[metadata].previous_title = 'Previous';
      }
    }
    if (metadatas[metadata].next) {
      if (metadatas[metadatas[metadata].next]) {
        metadatas[metadata].next_title =
          metadatas[metadatas[metadata].next].title;
      } else {
        metadatas[metadata].next_title = 'Next';
      }
    }
  });

  fs.writeFileSync(
    path.join(__dirname, '/../core/metadata.js'),
    `${'/**\n' +
    ' * @' +
    'generated\n' + // separate this out for Nuclide treating @generated as readonly
      ' */\n' +
      'module.exports = '}${JSON.stringify(metadatas, null, 2)};\n`,
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
        }T06:00:00.000Z`,
      );
      // allow easier sorting of blog by providing seconds since epoch
      metadata.seconds = Math.round(metadata.date.getTime() / 1000);

      metadatas.push(metadata);
    });

  const sortedMetadatas = metadatas.sort(
    (a, b) => parseInt(b.seconds, 10) - parseInt(a.seconds, 10),
  );

  fs.writeFileSync(
    path.join(__dirname, '/../core/MetadataBlog.js'),
    `${'/**\n' +
    ' * @' +
    'generated\n' + // separate this out for Nuclide treating @generated as readonly
      ' */\n' +
      'module.exports = '}${JSON.stringify(sortedMetadatas, null, 2)};\n`,
  );
}

module.exports = {
  getDocsPath,
  readSidebar,
  processMetadata,
  generateMetadataDocs,
  generateMetadataBlog,
};
