/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();
const glob = require("glob");
const fs = require("fs");
const path = require("path");
const diff = require("diff");
const assert = require("assert");

const siteConfig = require(CWD + "/siteConfig.js");

const ENABLE_TRANSLATION = fs.existsSync(CWD + "/languages.js");

let versions;
if (fs.existsSync(CWD + "/versions.json")) {
  versions = require(CWD + "/versions.json");
} else {
  versions = [];
}

let languages;
if (fs.existsSync(CWD + "/languages.js")) {
  languages = require(CWD + "/languages.js");
} else {
  languages = [
    {
      enabled: true,
      name: "English",
      tag: "en"
    }
  ];
}

/*****************************************************************/

// included to prevent cyclical dependency with readMetadata.js

function splitHeader(content) {
  const lines = content.split("\n");
  let i = 1;
  for (; i < lines.length - 1; ++i) {
    if (lines[i] === "---") {
      break;
    }
  }
  return {
    header: lines.slice(1, i + 1).join("\n"),
    content: lines.slice(i + 1).join("\n")
  };
}

// Extract markdown metadata header
function extractMetadata(content) {
  const metadata = {};
  const both = splitHeader(content);
  // if no content returned, then that means there was no header, and both.header is the content
  if (!both.content) {
    return { metadata, rawContent: both.header };
  }
  const lines = both.header.split("\n");
  for (let i = 0; i < lines.length - 1; ++i) {
    const keyvalue = lines[i].split(":");
    const key = keyvalue[0].trim();
    let value = keyvalue.slice(1).join(":").trim();
    try {
      value = JSON.parse(value);
    } catch (e) {}
    metadata[key] = value;
  }
  return { metadata, rawContent: both.content };
}

/*****************************************************************/

const versionFolder = CWD + "/versioned_docs/";

// available stores doc ids of documents that are available for
// each version
const available = {};
// versionFiles is used to keep track of what file to use with a
// given version/id of a document
const versionFiles = {};
let files = glob.sync(versionFolder + "**");
files.forEach(file => {
  const ext = path.extname(file);
  if (ext !== ".md" && ext !== ".markdown") {
    return;
  }
  const res = extractMetadata(fs.readFileSync(file, "utf8"));
  const metadata = res.metadata;

  if (!(metadata.original_id in available)) {
    available[metadata.original_id] = new Set();
  }
  const version = metadata.id.split("-")[1];
  available[metadata.original_id].add(version);

  if (!(version in versionFiles)) {
    versionFiles[version] = {};
  }
  versionFiles[version][metadata.original_id] = file;
});

// returns the version to use for a document based on its id and
// what the requested version is
function docVersion(id, req_version) {
  // iterate through versions until a version less than or equal to the requested
  // is found, then check if that verison has an available file to use
  let requestedFound = false;
  for (let i = 0; i < versions.length; i++) {
    if (versions[i] === req_version) {
      requestedFound = true;
    }
    if (!requestedFound) {
      continue;
    }
    if (!available[id]) {
      return null;
    }
    if (available[id].has(versions[i])) {
      return versions[i];
    }
  }
  throw new Error(
    `No document available to use for version ${req_version} of document with id ${id}. Verify that all version files are correct.`
  );
}

// returns whether a given file has content that differ from the
// document with the given id
function diffLatestDoc(file, id) {
  if (versions.length === 0) {
    return true;
  }

  const latest = versions[0];

  const version = docVersion(id, latest);
  if (!version) {
    return true;
  }
  const latestFile = versionFiles[version][id];

  if (!latestFile || !fs.existsSync(latestFile)) {
    return true;
  }

  const diffs = diff.diffChars(
    extractMetadata(fs.readFileSync(latestFile, "utf8")).rawContent,
    extractMetadata(fs.readFileSync(file, "utf8")).rawContent
  );
  diffs.forEach(part => {
    if (part.added || part.removed) {
      return true;
    }
  });
  return false;
}

// return metadata for a versioned file given the file, its version (requested),
// the version of the file to be used, and its language
function processVersionMetadata(file, version, useVersion, language) {
  const metadata = extractMetadata(fs.readFileSync(file, "utf8")).metadata;
  metadata.source = "version-" + useVersion + "/" + path.basename(file);

  const latestVersion = versions[0];

  if (!ENABLE_TRANSLATION && !siteConfig.useEnglishUrl) {
    metadata.permalink =
      "docs/" +
      (version !== latestVersion ? version + "/" : "") +
      metadata.original_id +
      ".html";
  } else {
    metadata.permalink =
      "docs/" +
      language +
      "/" +
      (version !== latestVersion ? version + "/" : "") +
      metadata.original_id +
      ".html";
  }
  metadata.id = metadata.id.replace(
    "version-" + useVersion + "-",
    "version-" + version + "-"
  );
  metadata.localized_id = metadata.id;
  metadata.id = language + "-" + metadata.id;
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
        const useVersion = docVersion(id, version);
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
        CWD + "/versioned_sidebars/version-" + versions[i] + "-sidebars.json"
      )
    ) {
      return versions[i];
    }
  }
  throw new Error(
    `No sidebar file available to use for version ${req_version}. Verify that all version files are correct.`
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
    CWD + "/versioned_sidebars/version-" + version + "-sidebars.json";
  if (!fs.existsSync(latestSidebar)) {
    return true;
  }
  const currentSidebar = CWD + "/sidebars.json";
  // if no current sidebar file, return false so no sidebar file gets copied
  if (!fs.existsSync(currentSidebar)) {
    return false;
  }

  // compare for equality between latest version sidebar with version prefixes
  // stripped and current sidebar
  return (
    JSON.stringify(JSON.parse(fs.readFileSync(latestSidebar, "utf8"))).replace(
      new RegExp("version-" + version + "-", "g"),
      ""
    ) !== JSON.stringify(JSON.parse(fs.readFileSync(currentSidebar, "utf8")))
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
          CWD + "/versioned_sidebars/version-" + version + "-sidebars.json",
          "utf8"
        )
        .replace(
          new RegExp("version-" + version + "-", "g"),
          "version-" + versions[i] + "-"
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
  sidebarData
};
