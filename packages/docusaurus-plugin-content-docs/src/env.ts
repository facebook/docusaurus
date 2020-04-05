/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {VersioningEnv, Env} from './types';
import {
  VERSIONS_JSON_FILE,
  VERSIONED_DOCS_DIR,
  VERSIONED_SIDEBARS_DIR,
} from './constants';

export function getVersionedDocsDir(siteDir: string) {
  return path.join(siteDir, VERSIONED_DOCS_DIR);
}

export function getVersionedSidebarsDir(siteDir: string) {
  return path.join(siteDir, VERSIONED_SIDEBARS_DIR);
}

export function getVersionsJSONFile(siteDir: string) {
  return path.join(siteDir, VERSIONS_JSON_FILE);
}

export default function (siteDir: string): Env {
  const versioning: VersioningEnv = {
    enabled: false,
    versions: [],
    latestVersion: null,
    docsDir: '',
    sidebarsDir: '',
  };

  const versionsJSONFile = getVersionsJSONFile(siteDir);
  if (fs.existsSync(versionsJSONFile)) {
    const parsedVersions = JSON.parse(
      fs.readFileSync(versionsJSONFile, 'utf8'),
    );
    if (parsedVersions && parsedVersions.length > 0) {
      versioning.latestVersion = parsedVersions[0];
      versioning.enabled = true;
      versioning.versions = parsedVersions;
      versioning.docsDir = getVersionedDocsDir(siteDir);
      versioning.sidebarsDir = getVersionedSidebarsDir(siteDir);
    }
  }

  return {
    versioning,
  };
}
