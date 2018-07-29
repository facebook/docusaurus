/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Populates an array of sidebars into an index to allow sidebar
 * and sibling docs resolving resolving by doc id
 *
 * @param {Object} allSidebars
 * { [sidebarId: string]: { [categoryName: string]: Array<string> } }
 *
 * @return {Object}
 * { [docId: string]: {
 *   previous: ?string,
 *   next: ?string,
 *   sidebar: string,
 *   category: string
 * } }
 */
function createDocsIndex(allSidebars) {
  const order = {};

  Object.keys(allSidebars).forEach(sidebar => {
    const categories = allSidebars[sidebar];

    let ids = [];
    const categoryOrder = [];

    Object.keys(categories).forEach(category => {
      ids = ids.concat(categories[category]);

      for (let i = 0; i < categories[category].length; i++) {
        categoryOrder.push(category);
      }
    });

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let previous;
      let next;

      if (i > 0) previous = ids[i - 1];
      if (i < ids.length - 1) next = ids[i + 1];

      order[id] = {
        previous,
        next,
        sidebar,
        category: categoryOrder[i],
      };
    }
  });

  return order;
}

module.exports = createDocsIndex;
