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
  for (let k = 0; k < enabledLanguages.length; k++) {
    const language = enabledLanguages[k];
    const metadatas = [];
    const categories = [];
    const sidebarMetadatas = {};

    // Get all related metadata for the current sidebar
    Object.keys(allMetadata).forEach(id => {
      const metadata = allMetadata[id];
      if (metadata.sidebar === sidebar && metadata.language === language) {
        metadatas.push(metadata);
        sidebarMetadatas[metadata.id] = metadata;
      }
    });

    // Sort the metadata
    metadatas.sort((a, b) => a.sort - b.sort);

    // Store the correct sort of categories and sub categories for later
    const sortedCategories = [];
    const sortedSubcategories = [];
    for (let i = 0; i < metadatas.length; ++i) {
      const metadata = metadatas[i];
      const category = metadata.category;
      const subcategory = metadata.subcategory;

      if (!sortedCategories.includes(category)) {
        sortedCategories.push(category);
      }

      if (subcategory && !sortedSubcategories.includes(subcategory)) {
        sortedSubcategories.push(subcategory);
      }
    }

    // Index categories and sub categories with all of their documents
    const indexedCategories = {};
    const indexedSubcategories = {};

    for (let i = 0; i < metadatas.length; i++) {
      const metadata = metadatas[i];
      const category = metadata.category;
      const subcategory = metadata.subcategory;

      // Validate sidebarMetadatas in the sidebar
      validateSidebar(metadata, sidebarMetadatas);

      if (!indexedCategories[category]) {
        indexedCategories[category] = [];
      }

      if (!subcategory) {
        indexedCategories[category].push(metadata);
      }

      if (subcategory) {
        if (!indexedSubcategories[category]) {
          indexedSubcategories[category] = {};
        }

        if (!indexedSubcategories[category][subcategory]) {
          indexedSubcategories[category][subcategory] = [];
        }

        indexedSubcategories[category][subcategory].push(metadata);
      }
    }

    // Generate data for each category and sub categories
    for (let i = 0; i < sortedCategories.length; i++) {
      const category = sortedCategories[i];
      const currentCategory = {
        name: category,
        links: indexedCategories[category],
      };

      for (let ii = 0; ii < sortedSubcategories.length; ii++) {
        const subcategory = sortedSubcategories[ii];

        if (
          indexedSubcategories[category] &&
          indexedSubcategories[category][subcategory]
        ) {
          if (!currentCategory.subcategories) {
            currentCategory.subcategories = [];
          }

          currentCategory.subcategories.push({
            name: subcategory,
            links: indexedSubcategories[category][subcategory],
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
