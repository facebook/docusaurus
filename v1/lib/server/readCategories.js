/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {validateSidebar} = require('./utils');

// returns data broken up into categories for a sidebar
function readCategories(sidebar, allMetadata, languages) {
  const enabledLanguages = languages
    .filter(lang => lang.enabled)
    .map(lang => lang.tag);

  const allCategories = {};

  // Go through each language that might be defined
  for (let k = 0; k < enabledLanguages.length; ++k) {
    const language = enabledLanguages[k];
    const metadatas = [];
    const categories = [];
    const pages = {};

    // Get the metadata for the current sidebar
    Object.keys(allMetadata).forEach(id => {
      const metadata = allMetadata[id];
      if (metadata.sidebar === sidebar && metadata.language === language) {
        metadatas.push(metadata);
        pages[metadata.id] = metadata;
      }
    });

    // Sort the metadata
    metadatas.sort((a, b) => a.sort - b.sort);

    // Store the correct sort of categories and sub categories for later
    const sortedCategories = [];
    const sortedSubCategories = [];
    for (let i = 0; i < metadatas.length; ++i) {
      const metadata = metadatas[i];
      const category = metadata.category;
      const subCategory = metadata.sub_category;

      if (!sortedCategories.includes(category)) {
        sortedCategories.push(category);
      }

      if (subCategory && !sortedSubCategories.includes(subCategory)) {
        sortedSubCategories.push(subCategory);
      }
    }

    // Index categories and sub categories with all of their documents
    const indexedCategories = {};
    const indexedSubCategories = {};
    for (let i = 0; i < metadatas.length; i++) {
      const metadata = metadatas[i];
      const category = metadata.category;
      const subCategory = metadata.sub_category;

      // Validate pages in the sidebar
      validateSidebar(metadata, pages);

      if (!indexedCategories[category]) {
        indexedCategories[category] = [];
      }

      if (!subCategory) {
        indexedCategories[category].push(metadata);
      }

      if (subCategory) {
        if (!indexedSubCategories[category]) {
          indexedSubCategories[category] = {};
        }

        if (!indexedSubCategories[category][subCategory]) {
          indexedSubCategories[category][subCategory] = [];
        }

        indexedSubCategories[category][subCategory].push(metadata);
      }
    }

    // Generate data for each category and sub categories
    for (let i = 0; i < sortedCategories.length; i++) {
      const category = sortedCategories[i];
      const currentCategory = {
        name: category,
        links: indexedCategories[category],
      };

      for (let ii = 0; ii < sortedSubCategories.length; ii++) {
        const subCategory = sortedSubCategories[ii];

        if (
          indexedSubCategories[category] &&
          indexedSubCategories[category][subCategory]
        ) {
          if (!currentCategory.sub_categories) {
            currentCategory.sub_categories = [];
          }

          currentCategory.sub_categories.push({
            name: subCategory,
            links: indexedSubCategories[category][subCategory],
          });
        }
      }

      categories.push(currentCategory);
    }

    allCategories[language] = categories;
  }

  return allCategories;
}

module.exports = readCategories;
