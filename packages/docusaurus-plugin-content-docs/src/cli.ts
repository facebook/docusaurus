/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import logger from '@docusaurus/logger';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import {
  getVersionsFilePath,
  getVersionDocsDirPath,
  getVersionSidebarsPath,
  getDocsDirPathLocalized,
  readVersionsFile,
} from './versions/files';
import {validateVersionName} from './versions/validation';
import {loadSidebarsFile} from './sidebars';
import {CURRENT_VERSION_NAME} from './constants';
import type {PluginOptions} from '@docusaurus/plugin-content-docs';
import type {LoadContext} from '@docusaurus/types';

async function createVersionedSidebarFile({
  siteDir,
  pluginId,
  sidebarPath,
  version,
}: {
  siteDir: string;
  pluginId: string;
  sidebarPath: string | false | undefined;
  version: string;
}) {
  // Load current sidebar and create a new versioned sidebars file (if needed).
  // Note: we don't need the sidebars file to be normalized: it's ok to let
  // plugin option changes to impact older, versioned sidebars
  // We don't validate here, assuming the user has already built the version
  const sidebars = await loadSidebarsFile(sidebarPath);

  // Do not create a useless versioned sidebars file if sidebars file is empty
  // or sidebars are disabled/false)
  const shouldCreateVersionedSidebarFile = Object.keys(sidebars).length > 0;

  if (shouldCreateVersionedSidebarFile) {
    await fs.outputFile(
      getVersionSidebarsPath(siteDir, pluginId, version),
      `${JSON.stringify(sidebars, null, 2)}\n`,
      'utf8',
    );
  }
}

// Tests depend on non-default export for mocking.
export async function cliDocsVersionCommand(
  version: unknown,
  {id: pluginId, path: docsPath, sidebarPath}: PluginOptions,
  {siteDir, i18n}: LoadContext,
): Promise<void> {
  // It wouldn't be very user-friendly to show a [default] log prefix,
  // so we use [docs] instead of [default]
  const pluginIdLogPrefix =
    pluginId === DEFAULT_PLUGIN_ID ? '[docs]' : `[${pluginId}]`;

  try {
    validateVersionName(version);
  } catch (err) {
    logger.info`${pluginIdLogPrefix}: Invalid version name provided. Try something like: 1.0.0`;
    throw err;
  }

  const versions = (await readVersionsFile(siteDir, pluginId)) ?? [];

  // Check if version already exists.
  if (versions.includes(version)) {
    throw new Error(
      `${pluginIdLogPrefix}: this version already exists! Use a version tag that does not already exist.`,
    );
  }

  if (i18n.locales.length > 1) {
    logger.info`Versioned docs will be created for the following locales: name=${i18n.locales}`;
  }

  await Promise.all(
    i18n.locales.map(async (locale) => {
      const localizationDir = path.resolve(
        siteDir,
        i18n.path,
        i18n.localeConfigs[locale]!.path,
      );
      // Copy docs files.
      const docsDir =
        locale === i18n.defaultLocale
          ? path.resolve(siteDir, docsPath)
          : getDocsDirPathLocalized({
              localizationDir,
              pluginId,
              versionName: CURRENT_VERSION_NAME,
            });

      if (
        !(await fs.pathExists(docsDir)) ||
        (await fs.readdir(docsDir)).length === 0
      ) {
        if (locale === i18n.defaultLocale) {
          throw new Error(
            logger.interpolate`${pluginIdLogPrefix}: no docs found in path=${docsDir}.`,
          );
        } else {
          logger.warn`${pluginIdLogPrefix}: no docs found in path=${docsDir}. Skipping.`;
          return;
        }
      }

      const newVersionDir =
        locale === i18n.defaultLocale
          ? getVersionDocsDirPath(siteDir, pluginId, version)
          : getDocsDirPathLocalized({
              localizationDir,
              pluginId,
              versionName: version,
            });
      await fs.copy(docsDir, newVersionDir);
    }),
  );

  await createVersionedSidebarFile({
    siteDir,
    pluginId,
    version,
    sidebarPath,
  });

  // Update versions.json file.
  versions.unshift(version);
  await fs.outputFile(
    getVersionsFilePath(siteDir, pluginId),
    `${JSON.stringify(versions, null, 2)}\n`,
  );

  logger.success`name=${pluginIdLogPrefix}: version name=${version} created!`;
}
