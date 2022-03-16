/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  getVersionsFilePath,
  getVersionedDocsDirPath,
  getVersionedSidebarsDirPath,
} from './versions';
import fs from 'fs-extra';
import path from 'path';
import type {
  PathOptions,
  SidebarOptions,
} from '@docusaurus/plugin-content-docs';
import {loadSidebarsFileUnsafe, resolveSidebarPathOption} from './sidebars';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import logger from '@docusaurus/logger';

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
  const sidebars = await loadSidebarsFileUnsafe(sidebarPath);

  // Do not create a useless versioned sidebars file if sidebars file is empty
  // or sidebars are disabled/false)
  const shouldCreateVersionedSidebarFile = Object.keys(sidebars).length > 0;

  if (shouldCreateVersionedSidebarFile) {
    const versionedSidebarsDir = getVersionedSidebarsDirPath(siteDir, pluginId);
    const newSidebarFile = path.join(
      versionedSidebarsDir,
      `version-${version}-sidebars.json`,
    );
    await fs.outputFile(
      newSidebarFile,
      `${JSON.stringify(sidebars, null, 2)}\n`,
      'utf8',
    );
  }
}

// Tests depend on non-default export for mocking.
export async function cliDocsVersionCommand(
  version: string | null | undefined,
  siteDir: string,
  pluginId: string,
  options: PathOptions & SidebarOptions,
): Promise<void> {
  // It wouldn't be very user-friendly to show a [default] log prefix,
  // so we use [docs] instead of [default]
  const pluginIdLogPrefix =
    pluginId === DEFAULT_PLUGIN_ID ? '[docs]' : `[${pluginId}]`;

  if (!version) {
    throw new Error(
      `${pluginIdLogPrefix}: no version tag specified! Pass the version you wish to create as an argument, for example: 1.0.0.`,
    );
  }

  if (version.includes('/') || version.includes('\\')) {
    throw new Error(
      `${pluginIdLogPrefix}: invalid version tag specified! Do not include slash (/) or backslash (\\). Try something like: 1.0.0.`,
    );
  }

  if (version.length > 32) {
    throw new Error(
      `${pluginIdLogPrefix}: invalid version tag specified! Length cannot exceed 32 characters. Try something like: 1.0.0.`,
    );
  }

  // Since we are going to create `version-${version}` folder, we need to make
  // sure it's a valid pathname.
  // eslint-disable-next-line no-control-regex
  if (/[<>:"|?*\x00-\x1F]/.test(version)) {
    throw new Error(
      `${pluginIdLogPrefix}: invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0.`,
    );
  }

  if (/^\.\.?$/.test(version)) {
    throw new Error(
      `${pluginIdLogPrefix}: invalid version tag specified! Do not name your version "." or "..". Try something like: 1.0.0.`,
    );
  }

  // Load existing versions.
  let versions = [];
  const versionsJSONFile = getVersionsFilePath(siteDir, pluginId);
  if (await fs.pathExists(versionsJSONFile)) {
    versions = JSON.parse(await fs.readFile(versionsJSONFile, 'utf8'));
  }

  // Check if version already exists.
  if (versions.includes(version)) {
    throw new Error(
      `${pluginIdLogPrefix}: this version already exists! Use a version tag that does not already exist.`,
    );
  }

  const {path: docsPath, sidebarPath} = options;

  // Copy docs files.
  const docsDir = path.join(siteDir, docsPath);

  if (
    (await fs.pathExists(docsDir)) &&
    (await fs.readdir(docsDir)).length > 0
  ) {
    const versionedDir = getVersionedDocsDirPath(siteDir, pluginId);
    const newVersionDir = path.join(versionedDir, `version-${version}`);
    await fs.copy(docsDir, newVersionDir);
  } else {
    throw new Error(`${pluginIdLogPrefix}: there is no docs to version!`);
  }

  await createVersionedSidebarFile({
    siteDir,
    pluginId,
    version,
    sidebarPath: resolveSidebarPathOption(siteDir, sidebarPath),
  });

  // Update versions.json file.
  versions.unshift(version);
  await fs.outputFile(
    versionsJSONFile,
    `${JSON.stringify(versions, null, 2)}\n`,
  );

  logger.success`name=${pluginIdLogPrefix}: version name=${version} created!`;
}
