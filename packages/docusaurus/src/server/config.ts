/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import importFresh from 'import-fresh';
import path from 'path';
import {DocusaurusConfig} from '@docusaurus/types';
import * as Joi from '@hapi/joi';
import {CONFIG_FILE_NAME} from '../constants';
import {ConfigSchema} from './configValidation';

export default function loadConfig(siteDir: string): DocusaurusConfig {
  const configPath = path.resolve(siteDir, CONFIG_FILE_NAME);

  if (!fs.existsSync(configPath)) {
    throw new Error(`${CONFIG_FILE_NAME} not found`);
  }

  const loadedConfig = importFresh(configPath) as Partial<DocusaurusConfig>;
  return Joi.attempt(loadedConfig, ConfigSchema);
}
