/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {VersioningEnv, Env, PluginOptions} from './types';
import {
  VERSIONS_JSON_FILE,
  VERSIONED_DOCS_DIR,
  VERSIONED_SIDEBARS_DIR,
  CURRENT_VERSION_NAME,
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

export function getVersionedDocsDirPath(
  siteDir: string,
  pluginId: string,
): string {
  return path.join(siteDir, addPluginIdPrefix(VERSIONED_DOCS_DIR, pluginId));
}

export function getVersionedSidebarsDirPath(
  siteDir: string,
  pluginId: string,
): string {
  return path.join(
    siteDir,
    addPluginIdPrefix(VERSIONED_SIDEBARS_DIR, pluginId),
  );
}

export function getVersionsFilePath(siteDir: string, pluginId: string): string {
  return path.join(siteDir, addPluginIdPrefix(VERSIONS_JSON_FILE, pluginId));
}

function readVersionsFile(siteDir: string, pluginId: string): string[] | null {
  const versionsFilePath = getVersionsFilePath(siteDir, pluginId);
  if (fs.existsSync(versionsFilePath)) {
    const content = JSON.parse(fs.readFileSync(versionsFilePath, 'utf8'));
    if (
      content instanceof Array &&
      content.every((version) => typeof version === 'string')
    ) {
      return content;
    } else {
      throw new Error(
        `The versions file should contain an array of versions! ${versionsFilePath}`,
      );
    }
  } else {
    return null;
  }
}

function readVersionNames(
  siteDir: string,
  {id: pluginId, disableVersioning, includeCurrentVersion}: PluginOptions,
): string[] {
  const versions = disableVersioning
    ? []
    : readVersionsFile(siteDir, pluginId) ?? [];

  // We add the current version at the beginning, unless
  // - user don't want to
  // - it's been explicitly added to versions.json
  if (includeCurrentVersion && !versions.includes(CURRENT_VERSION_NAME)) {
    versions.unshift(CURRENT_VERSION_NAME);
  }
  return versions;
}

type VersionMetadata = {
  versionName: string;
  docsPath: string;
  sidebarPath: string;
};

function createVersionMetadata({
  versionName,
  siteDir,
  options,
}: {
  versionName: string;
  siteDir: string;
  options: PluginOptions;
}): VersionMetadata {
  if (versionName === CURRENT_VERSION_NAME) {
    const docsPath = path.resolve(siteDir, options.path);
    const sidebarPath = path.resolve(siteDir, options.sidebarPath);
    return {versionName, docsPath, sidebarPath};
  } else {
    const docsPath = path.join(
      getVersionedDocsDirPath(siteDir, options.id),
      `version-${versionName}`,
    );
    const sidebarPath = path.join(
      getVersionedSidebarsDirPath(siteDir, options.id),
      `version-${versionName}-sidebars.json`,
    );
    return {versionName, docsPath, sidebarPath};
  }
}

function checkVersionMetadataPaths({
  versionName,
  docsPath,
  sidebarPath,
}: VersionMetadata) {
  if (!fs.existsSync(docsPath)) {
    throw new Error(
      `The docs folder does not exist for version [${versionName}]. A docs folder is expected to be found at ${docsPath}`,
    );
  }
  if (!fs.existsSync(sidebarPath)) {
    throw new Error(
      `The sidebar file does not exist for version [${versionName}]. A sidebar file is expected to be found at ${sidebarPath}`,
    );
  }
}

export function readVersionsMetadata(
  siteDir: string,
  options: PluginOptions,
): VersionMetadata[] {
  const versionNames = readVersionNames(siteDir, options);
  const versionsMetadata = versionNames.map((versionName) =>
    createVersionMetadata({versionName, siteDir, options}),
  );
  versionsMetadata.forEach(checkVersionMetadataPaths);
  return versionsMetadata;
}

// TODO remove soon
type EnvOptions = Partial<{
  disableVersioning: boolean;
  includeCurrentVersion: boolean;
}>;
export default function loadEnv(
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

  const versionsJSONFile = getVersionsFilePath(siteDir, pluginId);
  if (fs.existsSync(versionsJSONFile)) {
    if (!options.disableVersioning) {
      const parsedVersions = JSON.parse(
        fs.readFileSync(versionsJSONFile, 'utf8'),
      );
      if (parsedVersions && parsedVersions.length > 0) {
        versioning.latestVersion = parsedVersions[0];
        versioning.enabled = true;
        versioning.versions = parsedVersions;
        versioning.docsDir = getVersionedDocsDirPath(siteDir, pluginId);
        versioning.sidebarsDir = getVersionedSidebarsDirPath(siteDir, pluginId);
      }
    }
  }

  return {
    versioning,
  };
}
