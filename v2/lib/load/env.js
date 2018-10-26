/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const path = require('path');
const {idx} = require('./utils');

module.exports = function loadEnv({siteDir, siteConfig}) {
  // Translation
  const translation = {
    enabled: false,
    enabledLanguages: [],
    defaultLanguage: {},
  };

  const languagesFile = path.join(siteDir, 'languages.js');
  if (fs.existsSync(languagesFile)) {
    const languages = require(languagesFile); // eslint-disable-line

    /* Enabled languages */
    const enabledLanguages = languages.filter(lang => lang.enabled);
    if (!enabledLanguages || enabledLanguages.length === 0) {
      throw new Error(`Please at least enable one language in 'languages.js'`);
    }
    translation.enabledLanguages = enabledLanguages;

    /* Default Language */
    const {defaultLanguage: defaultLanguageTag} = siteConfig;
    const defaultLanguage = enabledLanguages.find(
      lang => lang.tag === defaultLanguageTag,
    );
    if (!defaultLanguage) {
      throw new Error(
        `Please set a default language in 'siteConfig.js' which is enabled in 'languages.js'`,
      );
    }
    translation.defaultLanguage = defaultLanguage;

    translation.enabled = true;
  }

  // Versioning
  const versioning = {
    enabled: false,
    latestVersion: null,
    defaultVersion: null,
    versions: [],
  };

  const versionsJSONFile = path.join(siteDir, 'versions.json');
  if (fs.existsSync(versionsJSONFile)) {
    versioning.enabled = true;
    versioning.versions = JSON.parse(fs.readFileSync(versionsJSONFile, 'utf8'));
    versioning.latestVersion = idx(versioning, ['versions', 0]);
    const {defaultVersionShown} = siteConfig;
    versioning.defaultVersion = defaultVersionShown || versioning.latestVersion;
  }

  return {
    translation,
    versioning,
  };
};
