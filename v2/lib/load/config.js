/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
    'baseUrl',
    'url',
    'headerLinks',
    'headerIcon',
    'favicon',
  ];
  const optionalFields = [
    'customDocsPath',
    'defaultLanguage',
    'highlight',
    'markdownPlugins',
    'configureWebpack',
    'chainWebpack',
    'docsUrl',
    'customFields',
    'githubHost',
    'algolia',
  ];
  const missingFields = requiredFields.filter(field => !config[field]);
  if (missingFields && missingFields.length > 0) {
    throw new Error(
      `${missingFields.join(', ')} fields are missing in siteConfig.js`,
    );
  }

  /* Fill default value */
  const defaultConfig = {
    customDocsPath: 'docs',
    docsUrl: 'docs',
  };
  Object.keys(defaultConfig).forEach(field => {
    if (!config[field]) {
      config[field] = defaultConfig[field];
    }
  });

  /* Build final headerLinks based on siteConfig */
  const {headerLinks} = config;
  // add language drop down to end if location not specified
  let languages = false;
  headerLinks.forEach(link => {
    if (link.languages) {
      languages = true;
    }
  });
  if (!languages) {
    headerLinks.push({languages: true});
  }
  let search = false;
  headerLinks.forEach(link => {
    // We will add search bar to end if location not specified
    if (link.search) {
      search = true;
    }
  });
  if (!search && config.algolia) {
    headerLinks.push({search: true});
  }
  config.headerLinks = headerLinks;

  /* 
    User's own array of custom fields, 
    e.g: if they want to include some field so they can access it later from `props.siteConfig`
  */
  const {customFields = []} = config;

  /* We don't allow useless/ not meaningful field */
  const allowedFields = [...requiredFields, ...optionalFields, ...customFields];
  const uselessFields = Object.keys(config).filter(
    field => !allowedFields.includes(field),
  );
  if (uselessFields && uselessFields.length > 0) {
    throw new Error(
      `${uselessFields.join(', ')} fields are useless in siteConfig.js`,
    );
  }

  return config;
};
