/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import importFresh from 'import-fresh';
import {DEFAULT_CONFIG_FILE_NAME} from '@docusaurus/utils';
import type {LoadContext} from '@docusaurus/types';
import {validateConfig} from './configValidation';

export async function loadSiteConfig({
  siteDir,
  customConfigFilePath,
}: {
  siteDir: string;
  customConfigFilePath?: string;
}): Promise<Pick<LoadContext, 'siteConfig' | 'siteConfigPath'>> {
  const siteConfigPath = path.resolve(
    siteDir,
    customConfigFilePath ?? DEFAULT_CONFIG_FILE_NAME,
  );

  if (!(await fs.pathExists(siteConfigPath))) {
    throw new Error(`Config file at "${siteConfigPath}" not found.`);
  }

  const importedConfig = importFresh(siteConfigPath);

  const loadedConfig =
    typeof importedConfig === 'function'
      ? await importedConfig()
      : await importedConfig;

  const siteConfig = validateConfig(loadedConfig);
  return {siteConfig, siteConfigPath};
}
