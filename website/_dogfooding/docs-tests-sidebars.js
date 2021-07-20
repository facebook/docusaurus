/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  sidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Index',
    },
    {
      type: 'category',
      label: 'Huge sidebar category',
      items: generateHugeSidebarItems(4),
    },
  ],
};

function generateHugeSidebarItems() {
  const maxLevel = 4;
  const linksCount = 5;
  const categoriesCount = 5;

  function generateRecursive(maxLevel, currentLevel = 0) {
    if (currentLevel === maxLevel) {
      return [];
    }

    const linkItems = [...Array(linksCount).keys()].map((index) => ({
      type: 'link',
      href: '/',
      label: `Link ${index} (level ${currentLevel + 1})`,
    }));

    const categoryItems = [...Array(categoriesCount).keys()].map((index) => ({
      type: 'category',
      label: `Category ${index} (level ${currentLevel + 1})`,
      items: generateRecursive(maxLevel, currentLevel + 1),
    }));

    return [...linkItems, ...categoryItems];
  }

  return generateRecursive(maxLevel);
}
