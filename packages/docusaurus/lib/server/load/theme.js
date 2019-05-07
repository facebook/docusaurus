/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const globby = require('globby');
const fs = require('fs-extra');
const path = require('path');
const {fileToPath, posixPath, normalizeUrl} = require('@docusaurus/utils');

module.exports = async function loadTheme(themePath) {
  if (!fs.existsSync(themePath)) {
    return null;
  }

  const themeComponentFiles = await globby(['**/*.{js,jsx}'], {
    cwd: themePath,
  });

  const alias = {};
  await Promise.all(
    themeComponentFiles.map(async relativeSource => {
      const filePath = path.join(themePath, relativeSource);
      const fileName = fileToPath(relativeSource);
      const aliasName = posixPath(
        normalizeUrl(['@theme', fileName]).replace(/\/$/, ''),
      );
      alias[aliasName] = filePath;
    }),
  );

  return alias;
};
