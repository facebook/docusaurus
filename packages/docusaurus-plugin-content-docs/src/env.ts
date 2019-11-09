/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {VersioningEnv, Env} from './types';
import {VERSIONS_JSON_FILE} from './constants';

export default function(siteDir: string): Env {
  const versioning: VersioningEnv = {
    enabled: false,
  };

  const versionsJSONFile = path.join(siteDir, VERSIONS_JSON_FILE);
  if (fs.existsSync(versionsJSONFile)) {
    versioning.versions = JSON.parse(fs.readFileSync(versionsJSONFile, 'utf8'));
    if (versioning.versions && versioning.versions.length > 0) {
      versioning.latestVersion = versioning.versions[0];
      versioning.enabled = true;
    }
  }

  return {
    versioning,
  };
}
