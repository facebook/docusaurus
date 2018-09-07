const fs = require('fs-extra');
const path = require('path');
const {idx} = require('../utils');

module.exports = function loadSidebars({siteDir, env}) {
  let allSidebars = {};

  // current sidebars
  const sidebarsJSONFile = path.join(siteDir, 'sidebars.json');
  if (fs.existsSync(sidebarsJSONFile)) {
    allSidebars = require(sidebarsJSONFile);
  }

  // versioned sidebars
  if (idx(env, ['versioning', 'enabled'])) {
    const versions = idx(env, ['versioning', 'versions']);
    versions &&
      versions.forEach(version => {
        const versionedSidebarsJSONFile = path.join(
          siteDir,
          'versioned_sidebars',
          `version-${version}-sidebars.json`
        );
        if (fs.existsSync(versionedSidebarsJSONFile)) {
          const sidebar = require(versionedSidebarsJSONFile);
          Object.assign(allSidebars, sidebar);
        } else {
          const missingFile = path.relative(siteDir, versionedSidebarsJSONFile);
          throw new Error(`Failed to load ${missingFile}. It does not exist.`);
        }
      });
  }
  return allSidebars;
};
