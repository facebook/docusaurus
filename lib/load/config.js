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
  const optionalFields = [
    'customDocsPath',
    'themePath',
    'highlight',
    'markdownPlugins'
  ];
  const missingFields = requiredFields.filter(field => !config[field]);
  if (missingFields && missingFields.length > 0) {
    throw new Error(
      `${missingFields.join(', ')} fields are missing in siteConfig.js`
    );
  }

  const uselessFields = Object.keys(config).filter(
    field => ![...requiredFields, ...optionalFields].includes(field)
  );
  if (uselessFields && uselessFields.length > 0) {
    throw new Error(
      `${uselessFields.join(', ')} fields are useless in siteConfig.js`
    );
  }

  return config;
};
