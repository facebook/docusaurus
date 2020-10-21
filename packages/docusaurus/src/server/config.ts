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
import {CONFIG_FILE_NAME} from '../constants';
import {validateConfig} from './configValidation';

export default function loadConfig(siteDir: string): DocusaurusConfig {
  // TODO temporary undocumented env variable: we should be able to use a cli option instead!
  const loadedConfigFileName =
    process.env.DOCUSAURUS_CONFIG || CONFIG_FILE_NAME;

  const configPath = path.resolve(siteDir, loadedConfigFileName);

  if (!fs.existsSync(configPath)) {
    throw new Error(`${CONFIG_FILE_NAME} not found at ${configPath}`);
  }

  const loadedConfig = importFresh(configPath) as Partial<DocusaurusConfig>;
  return validateConfig(loadedConfig);
}
