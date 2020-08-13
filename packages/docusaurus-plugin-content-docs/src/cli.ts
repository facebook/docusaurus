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
import {Sidebars, PathOptions, SidebarItem} from './types';
import {loadSidebars} from './sidebars';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/core/lib/constants';

// Tests depend on non-default export for mocking.
// eslint-disable-next-line import/prefer-default-export
export function cliDocsVersion(
  version: string | null | undefined,
  siteDir: string,
  pluginId: string,
  options: PathOptions,
): void {
  // It wouldn't be very user-friendly to show a [default] log prefix,
  // so we use [docs] instead of [default]
  const pluginIdLogPrefix =
    pluginId === DEFAULT_PLUGIN_ID ? '[docs] ' : `[${pluginId}] `;

  if (!version) {
    throw new Error(
      `${pluginIdLogPrefix}No version tag specified!. Pass the version you wish to create as an argument. Ex: 1.0.0`,
    );
  }

  if (version.includes('/') || version.includes('\\')) {
    throw new Error(
      `${pluginIdLogPrefix}Invalid version tag specified! Do not include slash (/) or (\\). Try something like: 1.0.0`,
    );
  }

  if (version.length > 32) {
    throw new Error(
      `${pluginIdLogPrefix}Invalid version tag specified! Length must <= 32 characters. Try something like: 1.0.0`,
    );
  }

  // Since we are going to create `version-${version}` folder, we need to make
  // sure it's a valid pathname.
  if (/[<>:"\/\\|?*\x00-\x1F]/g.test(version)) {
    throw new Error(
      `${pluginIdLogPrefix}Invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0`,
    );
  }

  if (/^\.\.?$/.test(version)) {
    throw new Error(
      `${pluginIdLogPrefix}Invalid version tag specified! Do not name your version "." or "..". Try something like: 1.0.0`,
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
      `${pluginIdLogPrefix}This version already exists!. Use a version tag that does not already exist.`,
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
    throw new Error(`${pluginIdLogPrefix}There is no docs to version !`);
  }

  // Load current sidebar and create a new versioned sidebars file.
  if (fs.existsSync(sidebarPath)) {
    const loadedSidebars: Sidebars = loadSidebars(sidebarPath);

    // Transform id in original sidebar to versioned id.
    const normalizeItem = (item: SidebarItem): SidebarItem => {
      switch (item.type) {
        case 'category':
          return {...item, items: item.items.map(normalizeItem)};
        case 'ref':
        case 'doc':
          return {
            type: item.type,
            id: `version-${version}/${item.id}`,
          };
        default:
          return item;
      }
    };

    const versionedSidebar: Sidebars = Object.entries(loadedSidebars).reduce(
      (acc: Sidebars, [sidebarId, sidebarItems]) => {
        const newVersionedSidebarId = `version-${version}/${sidebarId}`;
        acc[newVersionedSidebarId] = sidebarItems.map(normalizeItem);
        return acc;
      },
      {},
    );

    const versionedSidebarsDir = getVersionedSidebarsDirPath(siteDir, pluginId);
    const newSidebarFile = path.join(
      versionedSidebarsDir,
      `version-${version}-sidebars.json`,
    );
    fs.ensureDirSync(path.dirname(newSidebarFile));
    fs.writeFileSync(
      newSidebarFile,
      `${JSON.stringify(versionedSidebar, null, 2)}\n`,
      'utf8',
    );
  }

  // Update versions.json file.
  versions.unshift(version);
  fs.ensureDirSync(path.dirname(versionsJSONFile));
  fs.writeFileSync(versionsJSONFile, `${JSON.stringify(versions, null, 2)}\n`);

  console.log(`${pluginIdLogPrefix}Version ${version} created!`);
}
