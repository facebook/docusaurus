/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const path = require('path');

module.exports = function loadConfig(siteDir) {
  const customThemePath = path.resolve(siteDir, 'theme');
  const themePath = fs.existsSync(customThemePath)
    ? customThemePath
    : path.resolve(__dirname, '../theme');

  const themeComponents = [
    'Doc',
    'BlogPost',
    'BlogPage',
    'Pages',
    'Loading',
    'NotFound',
    'Markdown',
  ];
  themeComponents.forEach(component => {
    if (!require.resolve(path.join(themePath, component))) {
      throw new Error(
        `Failed to load ${themePath}/${component}. It does not exist.`,
      );
    }
  });

  return themePath;
};
