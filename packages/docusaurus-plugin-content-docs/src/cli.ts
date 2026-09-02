/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import logger from '@docusaurus/logger';
import {DEFAULT_PLUGIN_ID, getLocaleConfig} from '@docusaurus/utils';
import {
  getVersionsFilePath,
  getVersionDocsDirPath,
  getVersionSidebarsPath,
  getDocsDirPathLocalized,
  getPluginDirPathLocalized,
  readVersionsFile,
} from './versions/files';
import {validateVersionName} from './versions/validation';
import {loadSidebarsFile} from './sidebars';
import {CURRENT_VERSION_NAME} from './constants';
import type {PluginOptions} from '@docusaurus/plugin-content-docs';
import type {LoadContext} from '@docusaurus/types';

export type DocsVersionCommandOptions = {
  overwrite: boolean;
};

async function createVersionedSidebarFile({
  versionSidebarsPath,
  sidebarPath,
}: {
  versionSidebarsPath: string;
  sidebarPath: string | false | undefined;
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
      versionSidebarsPath,
      `${JSON.stringify(sidebars, null, 2)}\n`,
      'utf8',
    );
  }
}

// Tests depend on non-default export for mocking.
async function cliDocsVersionCommand(
  version: unknown,
  {id: pluginId, path: docsPath, sidebarPath}: PluginOptions,
  {siteDir, i18n}: LoadContext,
  commandOptions: Partial<DocsVersionCommandOptions> = {},
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
  const versionExists = versions.includes(version);

  // Check if version already exists.
  if (versionExists && !commandOptions.overwrite) {
    throw new Error(
      `${pluginIdLogPrefix}: version ${version} already exists. Use --overwrite to replace it, or choose a new version name.`,
    );
  } else if (versionExists) {
    logger.warn`${pluginIdLogPrefix}: version ${version} already exists and will be overwritten.`;
  }

  if (i18n.locales.length > 1) {
    logger.info`Versioned docs will be created for the following locales: name=${i18n.locales}`;
  }

  const versionSidebarsPath = getVersionSidebarsPath(
    siteDir,
    pluginId,
    version,
  );

  if (versionExists) {
    // Delete previous sidebar file in case overwritten version doesn't need it
    await fs.rm(versionSidebarsPath, {force: true});
  }

  await Promise.all(
    i18n.locales.map(async (locale) => {
      const isDefaultLocale = locale === i18n.defaultLocale;
      const localizationDir = path.resolve(
        siteDir,
        i18n.path,
        getLocaleConfig(i18n, locale).path,
      );
      const docsDir = isDefaultLocale
        ? path.resolve(siteDir, docsPath)
        : getDocsDirPathLocalized({
            localizationDir,
            pluginId,
            versionName: CURRENT_VERSION_NAME,
          });
      const versionedDocsDir = isDefaultLocale
        ? getVersionDocsDirPath(siteDir, pluginId, version)
        : getDocsDirPathLocalized({
            localizationDir,
            pluginId,
            versionName: version,
          });
      const pluginDir = getPluginDirPathLocalized({
        localizationDir,
        pluginId,
      });
      const translationFile = !isDefaultLocale
        ? path.join(pluginDir, `version-${version}.json`)
        : undefined;

      if (versionExists) {
        // Note: Will only remove locales still present in config.
        // Delete previous docs folder
        await fs.rm(versionedDocsDir, {recursive: true, force: true});

        if (!isDefaultLocale && translationFile) {
          // Delete previous JSON translation file
          await fs.rm(translationFile, {force: true});
        }
      }

      if (
        !(await fs.pathExists(docsDir)) ||
        (await fs.readdir(docsDir)).length === 0
      ) {
        if (isDefaultLocale) {
          throw new Error(
            logger.interpolate`${pluginIdLogPrefix}: no docs found in path=${docsDir}.`,
          );
        } else {
          logger.warn`${pluginIdLogPrefix}: no docs found in path=${docsDir}. Skipping.`;
          return;
        }
      }

      // Copy docs folder for this locale
      await fs.copy(docsDir, versionedDocsDir);

      // Copy version JSON translation file for this locale
      // i18n/<l>/docusaurus-plugin-content-docs/current.json => version-v1.json
      // See https://docusaurus.io/docs/next/api/plugins/@docusaurus/plugin-content-docs#translation-files-location
      if (!isDefaultLocale && translationFile) {
        const sourceFile = path.join(pluginDir, 'current.json');
        if (await fs.pathExists(sourceFile)) {
          await fs.copy(sourceFile, translationFile);
        } else {
          logger.warn`${pluginIdLogPrefix}: i18n translation file does not exist in path=${sourceFile}. Skipping.`;
        }
      }
    }),
  );

  await createVersionedSidebarFile({
    versionSidebarsPath,
    sidebarPath,
  });

  // Append new version to versions.json
  if (!versionExists) {
    versions.unshift(version);
    await fs.outputFile(
      getVersionsFilePath(siteDir, pluginId),
      `${JSON.stringify(versions, null, 2)}\n`,
    );
  }

  logger.success`name=${pluginIdLogPrefix}: version name=${version} created!`;
}

// TODO try to remove this workaround
// Why use a default export instead of named exports here?
// This is only to make Jest mocking happy
// After upgrading Jest/SWC we got this weird mocking error in extendCli tests
// "spyOn: Cannot redefine property cliDocsVersionCommand"
// I tried various workarounds, and it's the only one that worked :/
// See also:
// - https://pyk.sh/fixing-typeerror-cannot-redefine-property-x-error-in-jest-tests#heading-solution-2-using-barrel-imports
// - https://github.com/aelbore/esbuild-jest/issues/26
// - https://stackoverflow.com/questions/67872622/jest-spyon-not-working-on-index-file-cannot-redefine-property/69951703#69951703
export default {
  cliDocsVersionCommand,
};
