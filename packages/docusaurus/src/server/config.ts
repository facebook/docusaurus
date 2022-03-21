/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import importFresh from 'import-fresh';
import type {DocusaurusConfig} from '@docusaurus/types';
import {validateConfig} from './configValidation';

export default async function loadConfig(
  configPath: string,
): Promise<DocusaurusConfig> {
  if (!(await fs.pathExists(configPath))) {
    throw new Error(`Config file at "${configPath}" not found.`);
  }

  const importedConfig = importFresh(configPath) as
    | Partial<DocusaurusConfig>
    | Promise<Partial<DocusaurusConfig>>
    | (() => Partial<DocusaurusConfig>)
    | (() => Promise<Partial<DocusaurusConfig>>);

  const loadedConfig =
    typeof importedConfig === 'function'
      ? await importedConfig()
      : await importedConfig;

  return validateConfig(loadedConfig);
}
