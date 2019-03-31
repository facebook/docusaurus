/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const path = require('path');
const {idx} = require('@docusaurus/utils');

/**
 * Check that item contains only allowed keys
 *
 * @param {Object} item
 * @param {Array<string>} keys
 */
function assertItem(item, keys) {
  const unknownKeys = Object.keys(item).filter(
    key => !keys.includes(key) && key !== 'type',
  );

  if (unknownKeys.length) {
    throw new Error(
      `Unknown sidebar item keys: ${unknownKeys}. Item: ${JSON.stringify(
        item,
      )}`,
    );
  }
}

/**
 * Normalizes recursively category and all its children. Ensures, that at the end
 * each item will be an object with the corresponding type
 *
 * @param {Array<Object>} category
 * @param {number} [level=0]
 *
 * @return {Array<Object>}
 */
function normalizeCategory(category, level = 0) {
  if (level === 2) {
    throw new Error(
      `Can not process ${
        category.label
      } category. Categories can be nested only one level deep.`,
    );
  }

  assertItem(category, ['items', 'label']);

  if (!Array.isArray(category.items)) {
    throw new Error(
      `Error loading ${category.label} category. Category items must be array.`,
    );
  }

  const items = category.items.map(item => {
    switch (item.type) {
      case 'category':
        return normalizeCategory(item, level + 1);
      case 'link':
        assertItem(item, ['href', 'label']);
        break;
      case 'ref':
        assertItem(item, ['id', 'label']);
        break;
      default:
        if (typeof item === 'string') {
          return {
            type: 'doc',
            id: item,
          };
        }

        if (item.type !== 'doc') {
          throw new Error(`Unknown sidebar item type: ${item.type}`);
        }

        assertItem(item, ['id', 'label']);
        break;
    }

    return item;
  });

  return {...category, items};
}

/**
 * Converts sidebars object to mapping to arrays of sidebar item objects
 *
 * @param  {{[key: string]: Object}} sidebars
 *
 * @return {{[key: string]: Array<Object>}}
 */
function normalizeSidebar(sidebars) {
  return Object.entries(sidebars).reduce((acc, [sidebarId, sidebar]) => {
    let normalizedSidebar = sidebar;

    if (!Array.isArray(sidebar)) {
      // convert sidebar to a more generic structure
      normalizedSidebar = Object.entries(sidebar).map(([label, items]) => ({
        type: 'category',
        label,
        items,
      }));
    }

    acc[sidebarId] = normalizedSidebar.map(item => normalizeCategory(item));

    return acc;
  }, {});
}

module.exports = function loadSidebars({siteDir, env, sidebar}) {
  const allSidebars = sidebar;

  // Versioned sidebars.
  if (idx(env, ['versioning', 'enabled'])) {
    const versions = idx(env, ['versioning', 'versions']);
    if (Array.isArray(versions)) {
      versions.forEach(version => {
        const versionedSidebarsJSONFile = path.join(
          siteDir,
          'versioned_sidebars',
          `version-${version}-sidebars.json`,
        );
        if (fs.existsSync(versionedSidebarsJSONFile)) {
          const sidebar = require(versionedSidebarsJSONFile); // eslint-disable-line
          Object.assign(allSidebars, sidebar);
        } else {
          const missingFile = path.relative(siteDir, versionedSidebarsJSONFile);
          throw new Error(`Failed to load ${missingFile}. It does not exist.`);
        }
      });
    }
  }

  return normalizeSidebar(allSidebars);
};
