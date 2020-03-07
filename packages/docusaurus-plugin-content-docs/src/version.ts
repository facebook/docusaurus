/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  getVersionsJSONFile,
  getVersionedDocsDir,
  getVersionedSidebarsDir,
} from './env';
import fs from 'fs-extra';
import path from 'path';
import {Sidebar, PathOptions, SidebarItem} from './types';
import loadSidebars from './sidebars';

export function docsVersion(
  version: string | null | undefined,
  siteDir: string,
  options: PathOptions,
) {
  if (!version) {
    throw new Error(
      'No version tag specified!. Pass the version you wish to create as an argument. Ex: 1.0.0',
    );
  }

  if (version.includes('/') || version.includes('\\')) {
    throw new Error(
      `Invalid version tag specified! Do not include slash (/) or (\\). Try something like: 1.0.0`,
    );
  }

  if (version.length > 32) {
    throw new Error(
      'Invalid version tag specified! Length must <= 32 characters. Try something like: 1.0.0',
    );
  }

  // Since we are going to create `version-${version}` folder, we need to make
  // sure it's a valid pathname.
  if (/[<>:"\/\\|?*\x00-\x1F]/g.test(version)) {
    throw new Error(
      'Invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0',
    );
  }

  if (/^\.\.?$/.test(version)) {
    throw new Error(
      'Invalid version tag specified! Do not name your version "." or "..". Try something like: 1.0.0',
    );
  }

  // Load existing versions.
  let versions = [];
  const versionsJSONFile = getVersionsJSONFile(siteDir);
  if (fs.existsSync(versionsJSONFile)) {
    versions = JSON.parse(fs.readFileSync(versionsJSONFile, 'utf8'));
  }

  // Check if version already exists.
  if (versions.includes(version)) {
    throw new Error(
      'This version already exists!. Use a version tag that does not already exist.',
    );
  }

  const {path: docsPath, sidebarPath} = options;

  // Copy docs files.
  const docsDir = path.join(siteDir, docsPath);
  if (fs.existsSync(docsDir) && fs.readdirSync(docsDir).length > 0) {
    const versionedDir = getVersionedDocsDir(siteDir);
    const newVersionDir = path.join(versionedDir, `version-${version}`);
    fs.copySync(docsDir, newVersionDir);
  } else {
    throw new Error('There is no docs to version !');
  }

  // Load current sidebar and create a new versioned sidebars file.
  if (fs.existsSync(sidebarPath)) {
    const loadedSidebars: Sidebar = loadSidebars([sidebarPath]);

    // Transform id in original sidebar to versioned id.
    const normalizeItem = (item: SidebarItem): SidebarItem => {
      switch (item.type) {
        case 'category':
          return {...item, items: item.items.map(normalizeItem)};
        case 'ref':
        case 'doc':
          return {
            ...item,
            id: `version-${version}/${item.id}`,
          };
        default:
          return item;
      }
    };

    const versionedSidebar: Sidebar = Object.entries(loadedSidebars).reduce(
      (acc: Sidebar, [sidebarId, sidebarItems]) => {
        const newVersionedSidebarId = `version-${version}/${sidebarId}`;
        acc[newVersionedSidebarId] = sidebarItems.map(normalizeItem);
        return acc;
      },
      {},
    );

    const versionedSidebarsDir = getVersionedSidebarsDir(siteDir);
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

  console.log(`Version ${version} created!`);
}
