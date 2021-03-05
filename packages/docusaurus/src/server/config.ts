/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import importFresh from 'import-fresh';
import {DocusaurusConfig} from '@docusaurus/types';
import {validateConfig} from './configValidation';

export default function loadConfig(configPath: string): DocusaurusConfig {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file "${configPath}" not found`);
  }

  const loadedConfig = importFresh(configPath) as Partial<DocusaurusConfig>;
  return validateConfig(loadedConfig);
}
