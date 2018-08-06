const fs = require('fs-extra');
const path = require('path');

module.exports = function loadConfig(siteDir, deleteCache = true) {
  const configPath = path.resolve(siteDir, 'siteConfig.js');
  if (deleteCache) {
    delete require.cache[configPath];
  }
  let config = {};
  if (fs.existsSync(configPath)) {
    config = require(configPath); // eslint-disable-line
  }
  return config;
};
