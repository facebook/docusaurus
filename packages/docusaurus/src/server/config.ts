/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import importFresh from 'import-fresh';
import _ from 'lodash';
import path from 'path';
import {CONFIG_FILE_NAME} from '../constants';
import {DocusaurusConfig, PluginConfig} from './types';

const REQUIRED_FIELDS = ['baseUrl', 'favicon', 'tagline', 'title', 'url'];

const OPTIONAL_FIELDS = [
  'organizationName',
  'projectName',
  'customFields',
  'githubHost',
  'plugins',
  'themes',
  'presets',
  'themeConfig',
  'image',
];

const DEFAULT_CONFIG: {
  plugins: PluginConfig[];
  themes: PluginConfig[];
  customFields: {
    [key: string]: any;
  };
  themeConfig: {
    [key: string]: any;
  };
} = {
  plugins: [],
  themes: [],
  customFields: {},
  themeConfig: {},
};

function formatFields(fields: string[]): string {
  return fields.map(field => `'${field}'`).join(', ');
}

export function loadConfig(siteDir: string): DocusaurusConfig {
  const configPath = path.resolve(siteDir, CONFIG_FILE_NAME);

  if (!fs.existsSync(configPath)) {
    throw new Error(`${CONFIG_FILE_NAME} not found`);
  }
  const loadedConfig = importFresh(configPath);
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
  const config: DocusaurusConfig = {...DEFAULT_CONFIG, ...loadedConfig};

  // Don't allow unrecognized fields.
  const allowedFields = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];
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
