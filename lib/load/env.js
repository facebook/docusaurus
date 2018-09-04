const fs = require('fs-extra');
const path = require('path');

module.exports = function loadEnv({siteDir, siteConfig}) {
  // Translation
  const translation = {
    enabled: false,
    enabledLanguages: []
  };

  const languagesFile = path.join(siteDir, 'languages.js');
  if (fs.existsSync(languagesFile)) {
    translation.enabled = true;
    const languages = require(languagesFile);
    translation.enabledLanguages = languages.filter(lang => lang.enabled);
  }

  // Versioning
  const versioning = {
    enabled: false,
    latestVersion: null,
    defaultVersion: null,
    versions: []
  };

  const versionsJSONFile = path.join(siteDir, 'versions.json');
  if (fs.existsSync(versionsJSONFile)) {
    versioning.enabled = true;
    versioning.versions = JSON.parse(fs.readFileSync(versionsJSONFile, 'utf8'));
    versioning.latestVersion = versioning.versions[0];
    const {defaultVersionShown} = siteConfig;
    versioning.defaultVersion = defaultVersionShown || versioning.latestVersion;
  }

  return {
    translation,
    versioning
  };
};
