/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const _ = require('lodash');
const importFresh = require('import-fresh');
const path = require('path');
const {CONFIG_FILE_NAME} = require('../../constants');

const REQUIRED_FIELDS = [
  'baseUrl',
  'favicon',
  'headerIcon',
  'organizationName',
  'projectName',
  'tagline',
  'title',
  'url',
];

const OPTIONAL_FIELDS = [
  'customFields',
  'githubHost',
  'plugins',
  'presets',
  'themeConfig',
];

const DEFAULT_CONFIG = {
  plugins: [],
};

function formatFields(fields) {
  return fields.map(field => `'${field}'`).join(', ');
}

function loadConfig(siteDir) {
  const configPath = path.resolve(siteDir, CONFIG_FILE_NAME);
  let loadedConfig = {};
  if (fs.existsSync(configPath)) {
    loadedConfig = importFresh(configPath);
  }

  const missingFields = REQUIRED_FIELDS.filter(
    field => !_.has(loadedConfig, field),
  );
  if (missingFields.length > 0) {
    throw new Error(
      `The required field(s) ${formatFields(
        missingFields,
      )} are missing from ${CONFIG_FILE_NAME}`,
    );
  }

  // Merge default config with loaded config.
  const config = {...DEFAULT_CONFIG, ...loadedConfig};

  // User's own array of custom fields/
  // e.g: if they want to include some.field so they can access it later from `props.siteConfig`.
  const {customFields = []} = config;

  // Don't allow unrecognized fields.
  const allowedFields = [
    ...REQUIRED_FIELDS,
    ...OPTIONAL_FIELDS,
    ...customFields,
  ];
  const unrecognizedFields = Object.keys(config).filter(
    field => !allowedFields.includes(field),
  );
  if (unrecognizedFields && unrecognizedFields.length > 0) {
    throw new Error(
      `The field(s) ${formatFields(
        unrecognizedFields,
      )} are not recognized in ${CONFIG_FILE_NAME}`,
    );
  }

  return config;
}

module.exports = loadConfig;
