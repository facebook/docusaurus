/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import logger from '@docusaurus/logger';
import {
  DEFAULT_CONFIG_FILE_NAME,
  findAsyncSequential,
  loadFreshModule,
} from '@docusaurus/utils';
import {validateConfig} from './configValidation';
import type {LoadContext} from '@docusaurus/types';

async function findConfig(siteDir: string) {
  // We could support .mjs, .ts, etc. in the future
  const candidates = ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'].map(
    (ext) => DEFAULT_CONFIG_FILE_NAME + ext,
  );
  const configPath = await findAsyncSequential(
    candidates.map((file) => path.join(siteDir, file)),
    fs.pathExists,
  );
  if (!configPath) {
    const relativeSiteDir = path.relative(process.cwd(), siteDir);
    throw new Error(logger.interpolate`No config file found in site dir code=${relativeSiteDir}.
Expected one of:${candidates.map(logger.code)}
You can provide a custom config path with the code=${'--config'} option.
    `);
  }
  return configPath;
}

export async function loadSiteConfig({
  siteDir,
  customConfigFilePath,
}: {
  siteDir: string;
  customConfigFilePath?: string;
}): Promise<Pick<LoadContext, 'siteConfig' | 'siteConfigPath'>> {
  const siteConfigPath = customConfigFilePath
    ? path.resolve(siteDir, customConfigFilePath)
    : await findConfig(siteDir);

  if (!(await fs.pathExists(siteConfigPath))) {
    throw new Error(`Config file at "${siteConfigPath}" not found.`);
  }

  const importedConfig = await loadFreshModule(siteConfigPath);

  const loadedConfig: unknown =
    typeof importedConfig === 'function'
      ? await importedConfig()
      : await importedConfig;

  const siteConfig = validateConfig(
    loadedConfig,
    path.relative(siteDir, siteConfigPath),
  );
  return {siteConfig, siteConfigPath};
}
