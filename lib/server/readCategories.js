/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Metadata = require('../core/metadata.js');

// returns data broken up into categories for a sidebar
function readCategories(sidebar, requestedLanguage) {
  let original = [];
  let translated = [];

  // Iterate through all the metadata and get any with a matching language
  Object.keys(Metadata).forEach(id => {
    const metadata = Metadata[id];
    if (metadata.sidebar === sidebar) {
      if (metadata.language == requestedLanguage) {
        translated.push(metadata);
      } else if (metadata.language == undefined) {
        original.push(metadata);
      }
    }
  });

  // If we have zero matched, return the original (which may also be zero)
  // This mimics the original behavour
  let metadatas = translated.length > 0 ? translated : original;

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
          metadata.version
            ? `Improper sidebars file for version ${
                metadata.version
              }, document with id '${
                metadata.next
              }' not found. Make sure that all documents with ids specified in this version's sidebar file exist and that no ids are repeated.`
            : `Improper sidebars.json file, document with id '${
                metadata.next
              }' not found. Make sure that documents with the ids specified in sidebars.json exist and that no ids are repeated.`
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
        links: [],
      };
    }
    currentCategory.links.push(metadata);
    metadata = articles[metadata.next];
  }
  categories.push(currentCategory);

  return categories;
}

module.exports = readCategories;
