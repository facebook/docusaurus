/**
 * Copyright (c) 2017-present, Facebook, Inc.
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

export default function(siteDir: string): Env {
  const versioning: VersioningEnv = {
    enabled: false,
    versions: [],
    latestVersion: null,
    docsDir: '',
    sidebarsDir: '',
  };

  const versionsJSONFile = path.join(siteDir, VERSIONS_JSON_FILE);
  if (fs.existsSync(versionsJSONFile)) {
    const parsedVersions = JSON.parse(
      fs.readFileSync(versionsJSONFile, 'utf8'),
    );
    if (parsedVersions && parsedVersions.length > 0) {
      versioning.latestVersion = parsedVersions[0];
      versioning.enabled = true;
      versioning.versions = parsedVersions;
      (versioning.docsDir = path.join(siteDir, VERSIONED_DOCS_DIR)),
        (versioning.sidebarsDir = path.join(siteDir, VERSIONED_SIDEBARS_DIR));
    }
  }

  return {
    versioning,
  };
}
