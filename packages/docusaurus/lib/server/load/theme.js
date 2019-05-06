/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const path = require('path');

module.exports = async function loadConfig(siteDir) {
  const themePath = path.resolve(siteDir, 'theme');
  if (!fs.existsSync(themePath)) {
    return null;
  }

  // Read all the theme components in the theme directory of website.
  const readdirSync = dir => (fs.existsSync(dir) && fs.readdirSync(dir)) || [];
  const themeComponentFiles = readdirSync(themePath);

  const alias = {};
  await Promise.all(
    themeComponentFiles.map(async component => {
      const filePath = path.join(themePath, component);
      const fileStats = await fs.stat(filePath);
      const fileExt = fileStats.isFile() ? path.extname(filePath) : '';
      const fileName = path.basename(filePath, fileExt);
      alias[`@theme/${fileName}`] = filePath;
    }),
  );

  return alias;
};
