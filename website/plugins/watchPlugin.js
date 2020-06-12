/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs-extra');

// Add here all the TS packages you want to watch
const WatchTSPackages = [
  'docusaurus',
  'docusaurus-init',
  'docusaurus-plugin-client-redirects',
  'docusaurus-plugin-content-blog',
  'docusaurus-plugin-content-docs',
  'docusaurus-plugin-content-pages',
  'docusaurus-plugin-ideal-image',
  'docusaurus-plugin-sitemap',
  'docusaurus-utils',
];

const ensureExists = (path) => {
  if (!fs.existsSync(path)) {
    throw new Error(
      `Docusaurus site watchPlugin error: path does not exist: ${path}`,
    );
  }
  return path;
};

module.exports = function (context) {
  const packagesDir = ensureExists(
    path.resolve(context.siteDir, '../packages'),
  );

  const TSPathsToWatch = WatchTSPackages.map((tsPackage) => {
    const tsPackagePath = ensureExists(path.join(packagesDir, tsPackage));
    return `${tsPackagePath}/lib/**/*.*`;
  });

  return {
    name: 'docusaurus-website-watch-plugin',
    getPathsToWatchRestart() {
      return [...TSPathsToWatch];
    },
  };
};
