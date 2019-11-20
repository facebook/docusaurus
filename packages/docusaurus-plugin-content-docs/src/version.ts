/**
 * Copyright (c) 2017-present, Facebook, Inc.
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
import {Sidebar, SidebarItemCategory, PathOptions} from './types';
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

  // Since we are going to create `version-${version}` folder, we need to make sure its a valid path name
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

  // Load existing versions
  let versions = [];
  const versionsJSONFile = getVersionsJSONFile(siteDir);
  if (fs.existsSync(versionsJSONFile)) {
    versions = JSON.parse(fs.readFileSync(versionsJSONFile, 'utf8'));
  }

  // Check if version already exist
  if (versions.includes(version)) {
    throw new Error(
      'This version already exists!. Use a version tag that does not already exist.',
    );
  }

  const {path: docsPath, sidebarPath} = options;

  // Copy docs files
  const docsDir = path.join(siteDir, docsPath);
  if (fs.existsSync(docsDir) && fs.readdirSync(docsDir).length > 0) {
    const versionedDir = getVersionedDocsDir(siteDir);
    const newVersionDir = path.join(versionedDir, `version-${version}`);
    fs.copySync(docsDir, newVersionDir);
  } else {
    throw new Error('There is no docs to version !');
  }

  // Load current sidebar and create a new versioned sidebars file
  if (fs.existsSync(sidebarPath)) {
    const loadedSidebars: Sidebar = loadSidebars([sidebarPath]);

    // Transform id in original sidebar to versioned id
    const normalizeCategory = (
      category: SidebarItemCategory,
    ): SidebarItemCategory => {
      const items = category.items.map(item => {
        switch (item.type) {
          case 'category':
            return normalizeCategory(item);
          case 'ref':
          case 'doc':
            return {
              type: item.type,
              id: `version-${version}/${item.id}`,
            };
        }
        return item;
      });
      return {...category, items};
    };

    const versionedSidebar: Sidebar = Object.entries(loadedSidebars).reduce(
      (acc: Sidebar, [sidebarId, sidebarItemCategories]) => {
        const newVersionedSidebarId = `version-${version}/${sidebarId}`;
        acc[
          newVersionedSidebarId
        ] = sidebarItemCategories.map(sidebarItemCategory =>
          normalizeCategory(sidebarItemCategory),
        );
        return acc;
      },
      {},
    );

    const versionedSidebarsDir = getVersionedSidebarsDir(siteDir);
    const newSidebarFile = path.join(
      versionedSidebarsDir,
      `version-${version}-sidebars.json`,
    );
    fs.writeFileSync(
      newSidebarFile,
      `${JSON.stringify(versionedSidebar, null, 2)}\n`,
      'utf8',
    );
  }

  // update versions.json file
  versions.unshift(version);
  fs.writeFileSync(versionsJSONFile, `${JSON.stringify(versions, null, 2)}\n`);

  console.log(`Version ${version} created!`);
}
