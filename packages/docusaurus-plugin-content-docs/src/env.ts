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

import {DEFAULT_PLUGIN_ID} from '@docusaurus/core/lib/constants';

// retro-compatibility: no prefix for the default plugin id
function addPluginIdPrefix(fileOrDir: string, pluginId: string): string {
  if (pluginId === DEFAULT_PLUGIN_ID) {
    return fileOrDir;
  } else {
    return `${pluginId}_${fileOrDir}`;
  }
}

export function getVersionedDocsDir(siteDir: string, pluginId: string): string {
  return path.join(siteDir, addPluginIdPrefix(VERSIONED_DOCS_DIR, pluginId));
}

export function getVersionedSidebarsDir(
  siteDir: string,
  pluginId: string,
): string {
  return path.join(
    siteDir,
    addPluginIdPrefix(VERSIONED_SIDEBARS_DIR, pluginId),
  );
}

export function getVersionsJSONFile(siteDir: string, pluginId: string): string {
  return path.join(siteDir, addPluginIdPrefix(VERSIONS_JSON_FILE, pluginId));
}

type EnvOptions = Partial<{disableVersioning: boolean}>;

export default function (
  siteDir: string,
  pluginId: string,
  options: EnvOptions = {disableVersioning: false},
): Env {
  if (!siteDir) {
    throw new Error('unexpected, missing siteDir');
  }
  if (!pluginId) {
    throw new Error('unexpected, missing pluginId');
  }

  const versioning: VersioningEnv = {
    enabled: false,
    versions: [],
    latestVersion: null,
    docsDir: '',
    sidebarsDir: '',
  };

  const versionsJSONFile = getVersionsJSONFile(siteDir, pluginId);
  if (fs.existsSync(versionsJSONFile)) {
    if (!options.disableVersioning) {
      const parsedVersions = JSON.parse(
        fs.readFileSync(versionsJSONFile, 'utf8'),
      );
      if (parsedVersions && parsedVersions.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        versioning.latestVersion = parsedVersions[0];
        versioning.enabled = true;
        versioning.versions = parsedVersions;
        versioning.docsDir = getVersionedDocsDir(siteDir, pluginId);
        versioning.sidebarsDir = getVersionedSidebarsDir(siteDir, pluginId);
      }
    }
  }

  return {
    versioning,
  };
}
