const fs = require('fs-extra');
const path = require('path');
const {idx} = require('../utils');

module.exports = function loadSidebars({siteDir, env}, deleteCache = true) {
  let allSidebars = {};

  // current sidebars
  const sidebarsJSONFile = path.join(siteDir, 'sidebars.json');
  if (deleteCache) {
    delete require.cache[sidebarsJSONFile];
  }
  if (fs.existsSync(sidebarsJSONFile)) {
    allSidebars = require(sidebarsJSONFile); // eslint-disable-line
  }

  // versioned sidebars
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
  return allSidebars;
};
