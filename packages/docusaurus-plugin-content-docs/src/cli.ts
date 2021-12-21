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
import type {PathOptions, SidebarOptions} from './types';
import {loadSidebarsFile, resolveSidebarPathOption} from './sidebars';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import logger from '@docusaurus/logger';

function createVersionedSidebarFile({
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
  // Note: we don't need the sidebars file to be normalized: it's ok to let plugin option changes to impact older, versioned sidebars
  const sidebars = loadSidebarsFile(sidebarPath);

  // Do not create a useless versioned sidebars file if sidebars file is empty or sidebars are disabled/false)
  const shouldCreateVersionedSidebarFile = Object.keys(sidebars).length > 0;

  if (shouldCreateVersionedSidebarFile) {
    const versionedSidebarsDir = getVersionedSidebarsDirPath(siteDir, pluginId);
    const newSidebarFile = path.join(
      versionedSidebarsDir,
      `version-${version}-sidebars.json`,
    );
    fs.ensureDirSync(path.dirname(newSidebarFile));
    fs.writeFileSync(
      newSidebarFile,
      `${JSON.stringify(sidebars, null, 2)}\n`,
      'utf8',
    );
  }
}

// Tests depend on non-default export for mocking.
export function cliDocsVersionCommand(
  version: string | null | undefined,
  siteDir: string,
  pluginId: string,
  options: PathOptions & SidebarOptions,
): void {
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
  if (/[<>:"|?*\x00-\x1F]/g.test(version)) {
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
  if (fs.existsSync(versionsJSONFile)) {
    versions = JSON.parse(fs.readFileSync(versionsJSONFile, 'utf8'));
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

  if (fs.existsSync(docsDir) && fs.readdirSync(docsDir).length > 0) {
    const versionedDir = getVersionedDocsDirPath(siteDir, pluginId);
    const newVersionDir = path.join(versionedDir, `version-${version}`);
    fs.copySync(docsDir, newVersionDir);
  } else {
    throw new Error(`${pluginIdLogPrefix}: there is no docs to version!`);
  }

  createVersionedSidebarFile({
    siteDir,
    pluginId,
    version,
    sidebarPath: resolveSidebarPathOption(siteDir, sidebarPath),
  });

  // Update versions.json file.
  versions.unshift(version);
  fs.ensureDirSync(path.dirname(versionsJSONFile));
  fs.writeFileSync(versionsJSONFile, `${JSON.stringify(versions, null, 2)}\n`);

  logger.success`name=${pluginIdLogPrefix}: version name=${version} created!`;
}
