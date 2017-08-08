#!/usr/bin/env node

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
  let translations = {
    "localized-strings": {
      next: "Next",
      previous: "Previous",
      tagline: siteConfig.tagline
    },
    "pages-strings": {}
  };

  /* look through front matter of docs for titles and categories to translate */
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

      if (metadata.sidebar_title) {
        translations["localized-strings"][metadata.sidebar_title] =
          metadata.sidebar_title;
      }
    }
  });
  /* look through header links for text to translate */
  siteConfig.headerLinks.forEach(link => {
    if (link.label) {
      translations["localized-strings"][link.label] = link.label;
    }
  });

  /* find sidebar category titles to translate */
  Object.keys(sidebars).forEach(sb => {
    const categories = sidebars[sb];
    Object.keys(categories).forEach(category => {
      translations["localized-strings"][category] = category;
    });
  });

  files = glob.sync(CWD + "/versioned_sidebars/*");
  files.forEach(file => {
    if (!file.endsWith("-sidebar.json")) {
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

  /* go through pages to look for text inside translate tags */
  files = glob.sync(CWD + "/pages/en/**");
  files.forEach(file => {
    const extension = path.extname(file);
    if (extension === ".js") {
      const ast = babylon.parse(fs.readFileSync(file, "utf8"), {
        plugins: ["jsx"]
      });
      traverse(ast, {
        enter(path) {
          if (
            path.node.type === "JSXElement" &&
            path.node.openingElement.name.name === "translate"
          ) {
            const text = path.node.children[0].value
              .trim()
              .replace(/\s+/g, " ");
            let description = "no description given";
            const attributes = path.node.openingElement.attributes;
            for (let i = 0; i < attributes.length; i++) {
              if (attributes[i].name.name === "desc") {
                description = attributes[i].value.value;
              }
            }
            translations["pages-strings"][text + "|" + description] = text;
          }
        }
      });
    }
  });
  writeFileAndCreateFolder(
    CWD + "/i18n/en.json",
    JSON.stringify(translations, null, 2)
  );
}

execute();
