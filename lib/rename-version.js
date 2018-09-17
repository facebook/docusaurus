#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const chalk = require('chalk');
const program = require('commander');
const escapeStringRegexp = require('escape-string-regexp');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const metadataUtils = require('./server/metadataUtils.js');

const CWD = process.cwd();

// generate a doc header from metadata
function makeHeader(metadata) {
  let header = '---\n';
  Object.keys(metadata).forEach(key => {
    header += `${key}: ${metadata[key]}\n`;
  });
  header += '---\n';
  return header;
}

let currentVersion;
let newVersion;

program
  .arguments('<version_name> <new_version_name>')
  .action((ver1, ver2) => {
    currentVersion = ver1;
    newVersion = ver2;
  })
  .parse(process.argv);

// require user to input two command line arguments, current version to be
// renamed, and new version name
if (
  typeof currentVersion === 'undefined' ||
  typeof newVersion === 'undefined'
) {
  console.error(
    `${chalk.yellow(
      'Version numbers are not properly specified!',
    )}\nSpecify as command line arguments: the current version you wish to rename, then the version number you want to rename it to. `,
  );
  process.exit(1);
}

// error if no versions currently exist
if (!fs.existsSync(`${CWD}/versions.json`)) {
  console.error(
    `${chalk.yellow(
      'No versions found!',
    )}\nNo versions.json file currently exists. Use the \`versions\` script if you wish to create new versions.`,
  );
  process.exit(1);
}

const versions = JSON.parse(fs.readFileSync(`${CWD}/versions.json`, 'utf8'));

const versionIndex = versions.indexOf(currentVersion);
// error if current specified version does not exist
if (versionIndex < 0) {
  console.error(
    `${chalk.yellow(
      `Version ${currentVersion} does not currently exist!`,
    )}\n Version ${currentVersion} is not in the versions.json file. You can only rename existing versions.`,
  );
  process.exit(1);
}
// replace old version with new version in versions.json file
versions[versionIndex] = newVersion;
fs.writeFileSync(
  `${CWD}/versions.json`,
  `${JSON.stringify(versions, null, 2)}\n`,
);

// if folder of docs for this version exists, rename folder and rewrite doc
// headers to use new version
if (fs.existsSync(`${CWD}/versioned_docs/version-${currentVersion}`)) {
  fs.renameSync(
    `${CWD}/versioned_docs/version-${currentVersion}`,
    `${CWD}/versioned_docs/version-${newVersion}`,
  );

  const files = glob.sync(`${CWD}/versioned_docs/version-${newVersion}/*`);
  files.forEach(file => {
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
      `version-${currentVersion}-`,
      `version-${newVersion}-`,
    );
    fs.writeFileSync(file, makeHeader(metadata) + rawContent);
  });
}

// if sidebar file exists for this version, rename sidebar file and rewrite
// doc ids in the file
const currentSidebarFile = `${CWD}/versioned_sidebars/version-${currentVersion}-sidebars.json`;
const newSidebarFile = `${CWD}/versioned_sidebars/version-${newVersion}-sidebars.json`;
if (fs.existsSync(currentSidebarFile)) {
  fs.renameSync(currentSidebarFile, newSidebarFile);
  let sidebarContent = fs.readFileSync(newSidebarFile, 'utf8');
  sidebarContent = sidebarContent.replace(
    new RegExp(`version-${escapeStringRegexp(currentVersion)}-`, 'g'),
    `version-${newVersion}-`,
  );
  fs.writeFileSync(newSidebarFile, sidebarContent);
}

console.log(
  `${chalk.green('Successfully renamed version ')}${chalk.yellow(
    currentVersion,
  )}${chalk.green(' to version ')}${chalk.yellow(newVersion)}\n`,
);
