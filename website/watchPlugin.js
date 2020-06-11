const path = require('path');
const fs = require('fs-extra');

module.exports = function (context, options) {
  const packagesDir = path.resolve(context.siteDir, '../packages');

  const TSPackageFolders = [
    path.join(packagesDir, 'docusaurus-plugin-content-docs'),
    path.join(packagesDir, 'docusaurus-plugin-content-blog'),
    path.join(packagesDir, 'docusaurus-plugin-content-pages'),
  ];

  TSPackageFolders.forEach((tsPackageFolder) => {
    if (!fs.existsSync(tsPackageFolder)) {
      throw new Error(`TS package does not exist: ${tsPackageFolder}`);
    }
  });

  const TSPathsToWatch = TSPackageFolders.map(
    (tsPackagePath) => `${tsPackagePath}/lib/**/*.*`,
  );

  console.log('TSPathsToWatch', TSPathsToWatch);

  return {
    name: 'docusaurus-website-watch-plugin',
    getPathsToWatch() {
      return [...TSPathsToWatch];
    },
  };
};
