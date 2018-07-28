const fs = require('fs-extra');
const path = require('path');

module.exports = function loadConfig(sourceDir, deleteCache = true) {
  const configPath = path.resolve(sourceDir, '.blogi', 'config.js');
  if (deleteCache) {
    delete require.cache[configPath];
  }
  let config = {};
  if (fs.existsSync(configPath)) {
    config = require(configPath);
  }
  return config;
};
