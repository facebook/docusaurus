/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const CWD = process.cwd();

const Metadata = require("../core/metadata.js");
const fs = require("fs");
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
function readCategories(sidebar) {
  const enabledLanguages = [];
  languages.filter(lang => lang.enabled).map(lang => {
    enabledLanguages.push(lang.tag);
  });

  const allCategories = {};

  for (let k = 0; k < enabledLanguages.length; ++k) {
    const language = enabledLanguages[k];

    const metadatas = Metadata.filter(metadata => {
      return metadata.sidebar === sidebar && metadata.language === language;
    });

    // Build a hashmap of article_id -> metadata
    const articles = {};
    for (let i = 0; i < metadatas.length; ++i) {
      const metadata = metadatas[i];
      articles[metadata.id] = metadata;
    }

    // Build a hashmap of article_id -> previous_id
    const previous = {};
    for (let i = 0; i < metadatas.length; ++i) {
      const metadata = metadatas[i];
      if (metadata.next) {
        if (!articles[metadata.next]) {
          throw new Error(
            "`next: " + metadata.next + "` in " + metadata.id + " doesn't exist"
          );
        }
        previous[articles[metadata.next].id] = metadata.id;
      }
    }

    // Find the first element which doesn't have any previous
    let first = null;
    for (let i = 0; i < metadatas.length; ++i) {
      const metadata = metadatas[i];
      if (!previous[metadata.id]) {
        first = metadata;
        break;
      }
    }

    const categories = [];
    let currentCategory = null;

    let metadata = first;
    let i = 0;
    while (metadata && i++ < 1000) {
      if (!currentCategory || metadata.category !== currentCategory.name) {
        currentCategory && categories.push(currentCategory);
        currentCategory = {
          name: metadata.category,
          links: []
        };
      }
      currentCategory.links.push(metadata);
      metadata = articles[metadata.next];
    }
    categories.push(currentCategory);

    allCategories[language] = categories;
  }

  return allCategories;
}

module.exports = readCategories;
