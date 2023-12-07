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
  DEFAULT_THEME_FILE_NAME,
  findAsyncSequential,
  loadFreshModule,
} from '@docusaurus/utils';
import {validateConfig} from './configValidation';
import type {DocusaurusConfig, LoadContext} from '@docusaurus/types';

async function getConventionalSiteConfigPath(siteDir: string) {
  // We could support .mjs, .ts, etc. in the future
  const candidates = ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'].map(
    (ext) => DEFAULT_CONFIG_FILE_NAME + ext,
  );
  const configPath = await findAsyncSequential(
    candidates.map((file) => path.join(siteDir, file)),
    fs.pathExists,
  );
  if (!configPath) {
    const errorMessage = logger.interpolate`No config file found.
Expected one of:${candidates}
You can provide a custom config path with the code=${'--config'} option.`;
    throw new Error(errorMessage);
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
    : await getConventionalSiteConfigPath(siteDir);

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

async function findConventionalThemeConfigPath(
  siteDir: string,
): Promise<string | undefined> {
  // We could support .mjs, .ts, etc. in the future
  const candidates = ['.tsx', '.ts', '.jsx', '.js'].map(
    (ext) => DEFAULT_THEME_FILE_NAME + ext,
  );
  const themeConfigPath = await findAsyncSequential(
    candidates.map((file) => path.join(siteDir, file)),
    fs.pathExists,
  );

  return themeConfigPath;
}

// TODO add tests for this
export async function findThemeConfigPath(
  siteDir: string,
  siteConfig: DocusaurusConfig,
): Promise<string | undefined> {
  // TODO add support for custom themeConfig file path
  // EX: siteConfig.themeConfig: './theme.tsx'
  // Note: maybe it would be simpler to provide this path through the CLI?
  if (typeof siteConfig.themeConfig === 'string') {
    const customThemeConfigPath = siteConfig.themeConfig;
    if (!(await fs.pathExists(customThemeConfigPath))) {
      throw new Error(
        `Theme config file at "${customThemeConfigPath}" not found.`,
      );
    }
    return customThemeConfigPath;
  }
  const conventionalThemeConfigPath = await findConventionalThemeConfigPath(
    siteDir,
  );
  // In Docusaurus v3 we require users to provide either the theme config
  // through the conventional path, or through the legacy siteConfig attribute
  // To avoid issues we prevent users to not provide any theme config at all
  if (
    !conventionalThemeConfigPath &&
    Object.keys(siteConfig.themeConfig ?? {}).length === 0
  ) {
    throw new Error(
      `Theme config file couldn't be found at ${DEFAULT_THEME_FILE_NAME}.js or ${DEFAULT_THEME_FILE_NAME}.tsx`,
    );
  }
  return conventionalThemeConfigPath;
}
