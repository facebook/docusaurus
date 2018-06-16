/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const metadataUtils = require('./metadataUtils');

const env = require('./env.js');
const utils = require('./utils.js');
const siteConfig = require(CWD + '/siteConfig.js');

const ENABLE_TRANSLATION = fs.existsSync(CWD + '/languages.js');

let versions;
if (fs.existsSync(CWD + '/versions.json')) {
  versions = require(CWD + '/versions.json');
} else {
  versions = [];
}

let languages;
if (fs.existsSync(CWD + '/languages.js')) {
  languages = require(CWD + '/languages.js');
} else {
  languages = [
    {
      enabled: true,
      name: 'English',
      tag: 'en',
    },
  ];
}

const versionFolder = CWD + '/versioned_docs/';

// available stores doc ids of documents that are available for
// each version
const available = {};
// versionFiles is used to keep track of what file to use with a
// given version/id of a document
const versionFiles = {};
let files = glob.sync(versionFolder + '**');
files.forEach(file => {
  const ext = path.extname(file);
  if (ext !== '.md' && ext !== '.markdown') {
    return;
  }
  const res = metadataUtils.extractMetadata(fs.readFileSync(file, 'utf8'));
  const metadata = res.metadata;

  if (!metadata.original_id) {
    console.error(
      `No 'original_id' field found in ${file}. Perhaps you forgot to add it when importing prior versions of your docs?`
    );
    throw new Error(
      `No 'original_id' field found in ${file}. Perhaps you forgot to add it when importing prior versions of your docs?`
    );
  }
  if (!metadata.id) {
    console.error(`No 'id' field found in ${file}.`);
    throw new Error(`No 'id' field found in ${file}.`);
  } else if (metadata.id.indexOf('version-') === -1) {
    console.error(
      `The 'id' field in ${file} is missing the expected 'version-XX-' prefix. Perhaps you forgot to add it when importing prior versions of your docs?`
    );
    throw new Error(
      `The 'id' field in ${file} is missing the expected 'version-XX-' prefix. Perhaps you forgot to add it when importing prior versions of your docs?`
    );
  }

  if (!(metadata.original_id in available)) {
    available[metadata.original_id] = new Set();
  }
  // The version will be between "version-" and "-<metadata.original_id>"
  // e.g. version-1.0.0-beta.2-doc1 => 1.0.0-beta.2
  // e.g. version-1.0.0-doc2 => 1.0.0
  // e.g. version-1.0.0-getting-started => 1.0.0
  const version = metadata.id.substring(
    metadata.id.indexOf('version-') + 8, // version- is 8 characters
    metadata.id.lastIndexOf('-' + metadata.original_id)
  );
  available[metadata.original_id].add(version);

  if (!(version in versionFiles)) {
    versionFiles[version] = {};
  }
  versionFiles[version][metadata.original_id] = file;
});

// returns the version to use for a document based on its id and
// what the requested version is
function docVersion(id, req_version) {
  if (!available[id]) {
    return null;
  }
  // iterate through versions until a version less than or equal to the requested
  // is found, then check if that version has an available file to use
  let requestedFound = false;
  for (let i = 0; i < versions.length; i++) {
    if (versions[i] === req_version) {
      requestedFound = true;
    }
    if (!requestedFound) {
      continue;
    }
    if (available[id].has(versions[i])) {
      return versions[i];
    }
  }
  return null;
}

// returns whether a given file has content that differ from the
// document with the given id
function diffLatestDoc(file, id) {
  if (versions.length === 0) {
    return true;
  }

  const latest = versions[0];

  let version;
  try {
    version = docVersion(id, latest);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  if (!version) {
    return true;
  }
  const latestFile = versionFiles[version][id];

  if (!latestFile || !fs.existsSync(latestFile)) {
    return true;
  }

  return (
    metadataUtils
      .extractMetadata(fs.readFileSync(latestFile, 'utf8'))
      .rawContent.trim() !==
    metadataUtils
      .extractMetadata(fs.readFileSync(file, 'utf8'))
      .rawContent.trim()
  );
}

// return metadata for a versioned file given the file, its version (requested),
// the version of the file to be used, and its language
function processVersionMetadata(file, version, useVersion, language) {
  const metadata = metadataUtils.extractMetadata(fs.readFileSync(file, 'utf8'))
    .metadata;

  // Add subdirectory information to versioned_doc metadata
  // Example: `versioned_docs/version-1.1.6/projectA/readme.md` file with id `version-1.1.6-readme`
  // and original_id `readme` will have metadata id of `version-1.1.6-projectA/readme` and original_id `projectA/readme`
  const subDir = utils.getSubDir(
    file,
    path.join(CWD, 'versioned_docs', `version-${useVersion}`)
  );
  if (subDir) {
    metadata.original_id = `${subDir}/${metadata.original_id}`;
    metadata.id = metadata.id.replace(
      `version-${useVersion}-`,
      `version-${useVersion}-${subDir}/`
    );
  }

  metadata.source = subDir
    ? `version-${useVersion}/${subDir}/${path.basename(file)}`
    : `version-${useVersion}/${path.basename(file)}`;

  const latestVersion = versions[0];

  if (!ENABLE_TRANSLATION && !siteConfig.useEnglishUrl) {
    metadata.permalink =
      'docs/' +
      (version !== latestVersion ? version + '/' : '') +
      metadata.original_id +
      '.html';
  } else {
    metadata.permalink =
      'docs/' +
      language +
      '/' +
      (version !== latestVersion ? version + '/' : '') +
      metadata.original_id +
      '.html';
  }
  metadata.id = metadata.id.replace(
    'version-' + useVersion + '-',
    'version-' + version + '-'
  );
  metadata.localized_id = metadata.id;
  metadata.id = (env.translation.enabled ? language + '-' : '') + metadata.id;
  metadata.language = language;
  metadata.version = version;

  return metadata;
}

// return all metadata of versioned documents
function docData() {
  const allIds = new Set();
  Object.keys(versionFiles).forEach(version => {
    Object.keys(versionFiles[version]).forEach(id => {
      allIds.add(id);
    });
  });

  const metadatas = [];

  languages.filter(language => language.enabled).forEach(language => {
    versions.forEach(version => {
      allIds.forEach(id => {
        let useVersion;
        try {
          useVersion = docVersion(id, version);
        } catch (e) {
          console.log(e);
          process.exit(1);
        }
        if (!useVersion) {
          return;
        }
        const file = versionFiles[useVersion][id];

        metadatas.push(
          processVersionMetadata(file, version, useVersion, language.tag)
        );
      });
    });
  });

  return metadatas;
}

// return the version of the sidebar to use given a requested version
function sidebarVersion(req_version) {
  // iterate through versions until a version less than or equal to the requested
  // is found, then check if that version has an available file to use
  let requestedFound = false;
  for (let i = 0; i < versions.length; i++) {
    if (versions[i] === req_version) {
      requestedFound = true;
    }
    if (!requestedFound) {
      continue;
    }
    if (
      fs.existsSync(
        CWD + '/versioned_sidebars/version-' + versions[i] + '-sidebars.json'
      )
    ) {
      return versions[i];
    }
  }
  throw new Error(
    `No sidebar file available to use for version ${req_version}. Verify that 'version-${req_version}-sidebars.json' exists.`
  );
}

// return whether or not the current sidebars.json file differs from the
// latest versioned one
function diffLatestSidebar() {
  if (versions.length === 0) {
    return true;
  }
  const latest = versions[0];

  const version = sidebarVersion(latest);
  const latestSidebar =
    CWD + '/versioned_sidebars/version-' + version + '-sidebars.json';
  if (!fs.existsSync(latestSidebar)) {
    return true;
  }
  const currentSidebar = CWD + '/sidebars.json';
  // if no current sidebar file, return false so no sidebar file gets copied
  if (!fs.existsSync(currentSidebar)) {
    return false;
  }

  // compare for equality between latest version sidebar with version prefixes
  // stripped and current sidebar
  return (
    JSON.stringify(JSON.parse(fs.readFileSync(latestSidebar, 'utf8'))).replace(
      new RegExp('version-' + version + '-', 'g'),
      ''
    ) !== JSON.stringify(JSON.parse(fs.readFileSync(currentSidebar, 'utf8')))
  );
}

// return all versioned sidebar data
function sidebarData() {
  const allSidebars = {};

  for (let i = 0; i < versions.length; i++) {
    const version = sidebarVersion(versions[i]);
    const sidebar = JSON.parse(
      fs
        .readFileSync(
          CWD + '/versioned_sidebars/version-' + version + '-sidebars.json',
          'utf8'
        )
        .replace(
          new RegExp('version-' + version + '-', 'g'),
          'version-' + versions[i] + '-'
        )
    );
    Object.assign(allSidebars, sidebar);
  }
  return allSidebars;
}

module.exports = {
  docVersion,
  diffLatestDoc,
  processVersionMetadata,
  docData,
  sidebarVersion,
  diffLatestSidebar,
  sidebarData,
};
