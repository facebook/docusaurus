#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const glob = require("glob");
const fs = require("fs-extra");
const path = require("path");
const mkdirp = require("mkdirp");
const readMetadata = require("./server/readMetadata.js");
const versionFallback = require("./server/versionFallback.js");

const CWD = process.cwd();
let versions;
if (fs.existsSync(CWD + "/versions.json")) {
 versions = require(CWD + "/versions.json");
} else {
  versions = [];
}

let version;

const program = require("commander");
program
  .arguments("<version>")
  .action(ver => {
    version = ver;
  })
  .parse(process.argv);

if (typeof version === "undefined") {
  console.error(
    "No version number specified!\nPass the version you wish to create as an argument.\nEx: 1.0.0"
  );
  process.exit(1);
}

if (versions.includes(version)) {
  console.error(
    "This verison already exists!\nSpecify a new version to create that does not already exist."
  );
  process.exit(1);
}

function makeHeader(metadata) {
  let header = "---\n";
  Object.keys(metadata).forEach(key => {
    header += key + ": " + metadata[key] + "\n";
  });
  header += "---\n";
  return header;
}

const versionFolder = CWD + "/versioned_docs/version-" + version;

mkdirp.sync(versionFolder);

// copy necessary files to new version, changing some of its metadata to reflect the versioning
let files = glob.sync(CWD + "/../docs/*");
files.forEach(file => {
  const ext = path.extname(file);
  if (ext !== ".md" && ext !== ".markdown") {
    return;
  }

  const res = readMetadata.extractMetadata(fs.readFileSync(file, "utf8"));
  let metadata = res.metadata;
  let rawContent = res.rawContent;
  if (!metadata.id) {
    return;
  }

  if (!versionFallback.diffLatestDoc(file, metadata.id)) {
    return;
  }

  metadata.original_id = metadata.id;
  metadata.id = "version-" + version + "-" + metadata.id;

  const targetFile =
    CWD + "/versioned_docs/version-" + version + "/" + path.basename(file);

  fs.writeFileSync(targetFile, makeHeader(metadata) + rawContent, "utf8");
});

// copy sidebar if necessary
if (versionFallback.diffLatestSidebar()) {
  mkdirp(CWD + "/versioned_sidebars");
  const sidebar = JSON.parse(fs.readFileSync(CWD + "/sidebar.json", "utf8"));
  const versioned = {};

  Object.keys(sidebar).forEach(sb => {
    const version_sb = "version-" + version + "-" + sb;
    versioned[version_sb] = {};

    const categories = sidebar[sb];
    Object.keys(categories).forEach(category => {
      versioned[version_sb][category] = [];

      const ids = categories[category];
      ids.forEach((id, index) => {
        versioned[version_sb][category].push("version-" + version + "-" + id);
      });
    });
  });

  fs.writeFileSync(
    CWD + "/versioned_sidebars/version-" + version + "-sidebar.json",
    JSON.stringify(versioned, null, 2),
    "utf8"
  );
}

// update versions.json file
versions.unshift(version);
fs.writeFileSync(CWD + "/versions.json", JSON.stringify(versions, null, 2));
