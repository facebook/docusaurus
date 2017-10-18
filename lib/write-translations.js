#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* generate the i18n/en.json file */

const CWD = process.cwd();
const fs = require("fs-extra");
const mkdirp = require("mkdirp");
const glob = require("glob");
const readMetadata = require("./server/readMetadata.js");
const path = require("path");
const siteConfig = require(CWD + "/siteConfig.js");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const sidebars = require(CWD + "/sidebars.json");

function writeFileAndCreateFolder(file, content) {
  mkdirp.sync(file.replace(new RegExp("/[^/]*$"), ""));
  fs.writeFileSync(file, content);
}

function execute() {
  console.log("Extracting translateable strings from files...");

  let translations = {
    "localized-strings": {
      next: "Next",
      previous: "Previous",
      tagline: siteConfig.tagline
    },
    "pages-strings": {}
  };

  // look through markdown headers of docs for titles and categories to translate
  let files = glob.sync(CWD + "/../docs/**");
  files.forEach(file => {
    const extension = path.extname(file);
    if (extension === ".md" || extension === ".markdown") {
      const res = readMetadata.processMetadata(file);
      if (!res) {
        return;
      }
      const metadata = res.metadata;

      translations["localized-strings"][metadata.localized_id] = metadata.title;

      if (metadata.sidebar_label) {
        translations["localized-strings"][metadata.sidebar_label] =
          metadata.sidebar_label;
      }
    }
  });
  // look through header links for text to translate
  siteConfig.headerLinks.forEach(link => {
    if (link.label) {
      translations["localized-strings"][link.label] = link.label;
    }
  });

  // find sidebar category titles to translate
  Object.keys(sidebars).forEach(sb => {
    const categories = sidebars[sb];
    Object.keys(categories).forEach(category => {
      translations["localized-strings"][category] = category;
    });
  });

  files = glob.sync(CWD + "/versioned_sidebars/*");
  files.forEach(file => {
    if (!file.endsWith("-sidebars.json")) {
      return;
    }
    sidebarContent = JSON.parse(fs.readFileSync(file, "utf8"));
    Object.keys(sidebarContent).forEach(sb => {
      const categories = sidebarContent[sb];
      Object.keys(categories).forEach(category => {
        translations["localized-strings"][category] = category;
      });
    });
  });

  // Manually add 'Help Translate' to en.json
  translations["pages-strings"][
    "Help Translate|recruit community translators for your project"
  ] =
    "Help Translate";
  writeFileAndCreateFolder(
    CWD + "/i18n/en.json",
    JSON.stringify(translations, null, 2)
  );
}

execute();

module.exports = execute;
