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

  const requiredFields = [
    'title',
    'tagline',
    'organizationName',
    'projectName',
    'baseUrl'
  ];
  const missingFields = requiredFields.filter(field => !config[field]);
  if (missingFields && missingFields.length > 0) {
    throw new Error(missingFields.join(', ') + ' are missing in siteConfig.js');
  }
  return config;
};
