/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const _ = require('lodash');

// returns data broken up into categories for a sidebar
function readCategories(sidebar, allMetadata, languages) {
  const allCategories = {};

  // Go through each language that might be defined.
  languages
    .filter(lang => lang.enabled)
    .map(lang => lang.tag)
    .forEach(language => {
      // Get all related metadata for the current sidebar and specific to the language.
      const metadatas = Object.values(allMetadata)
        .filter(
          metadata =>
            metadata.sidebar === sidebar && metadata.language === language,
        )
        .sort((a, b) => a.order - b.order);

      // Define the correct order of categories.
      const sortedCategories = _.uniq(
        metadatas.map(metadata => metadata.category),
      );

      const metadatasGroupedByCategory = _.chain(metadatas)
        .groupBy(metadata => metadata.category)
        .mapValues(categoryItems => {
          // Process subcategories.
          const metadatasGroupedBySubcategory = _.groupBy(
            categoryItems,
            item => item.subcategory,
          );
          const result = [];
          const seenSubcategories = new Set();
          // categoryItems can be links or subcategories. Handle separately.
          categoryItems.forEach(item => {
            // Has no subcategory.
            if (item.subcategory == null) {
              result.push({
                type: 'LINK',
                item,
              });
              return;
            }

            const {subcategory} = item;
            // Subcategory has been processed, we can skip it.
            if (seenSubcategories.has(subcategory)) {
              return;
            }

            seenSubcategories.add(subcategory);
            const subcategoryLinks = metadatasGroupedBySubcategory[
              subcategory
            ].map(subcategoryItem => ({
              type: 'LINK',
              item: subcategoryItem,
            }));
            result.push({
              type: 'SUBCATEGORY',
              title: subcategory,
              children: subcategoryLinks,
            });
          });

          return result;
        })
        .value();

      const categories = sortedCategories.map(category => ({
        type: 'CATEGORY',
        title: category,
        children: metadatasGroupedByCategory[category],
      }));
      allCategories[language] = categories;
    });

  return allCategories;
}

module.exports = readCategories;
