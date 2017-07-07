/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/* generate the i18n/en.json file */

const CWD = process.cwd();
const fs = require("fs-extra");
const mkdirp = require("mkdirp");
const glob = require("glob");
const readMetadata = require("./readMetadata.js");
const path = require("path");
const shell = require("shelljs");
const siteConfig = require(CWD + "/siteConfig.js");

function writeFileAndCreateFolder(file, content) {
  mkdirp.sync(file.replace(new RegExp("/[^/]*$"), ""));
  fs.writeFileSync(file, content);
}

function execute() {
  let translations = {
    "localized-strings": {
      next: "Next",
      previous: "Previous"
    },
    tagline: siteConfig.tagline,
    "pages-strings": {}
  };

  /* look through front matter of docs for titles and categories to translate */
  let files = glob.sync(CWD + "/../docs/en/**");
  files.forEach(file => {
    const extension = path.extname(file);
    if (extension === ".md" || extension === ".markdown") {
      const metadata = readMetadata.extractMetadata(
        fs.readFileSync(file, "utf8")
      ).metadata;

      translations["localized-strings"][metadata.id] = metadata.title;
      translations["localized-strings"][metadata.category] = metadata.category;
    }
  });
  /* look through header links for text to translate */
  for (let i = 0; i < siteConfig.headerLinksInternal.length; i++) {
    translations["localized-strings"][siteConfig.headerLinksInternal[i].text] =
      siteConfig.headerLinksInternal[i].text;
  }
  for (let i = 0; i < siteConfig.headerLinksExternal.length; i++) {
    translations["localized-strings"][siteConfig.headerLinksExternal[i].text] =
      siteConfig.headerLinksExternal[i].text;
  }
  writeFileAndCreateFolder(CWD + "/i18n/en.json", JSON.stringify(translations));

  /* go through pages to look for text inside translate tags */
  const plugin = __dirname + "/find-strings-plugin.js";
  files = glob.sync(CWD + "/pages/en/**");
  files.forEach(file => {
    const extension = path.extname(file);
    if (extension === ".js") {
      shell.exec(
        `babel ${file} --plugins=${plugin} --presets=react > /dev/null`
      );
    }
  });
}

module.exports = execute;
