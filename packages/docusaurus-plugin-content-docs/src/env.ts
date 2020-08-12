/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {VersioningEnv, Env, PluginOptions, VersionMetadata} from './types';
import {
  VERSIONS_JSON_FILE,
  VERSIONED_DOCS_DIR,
  VERSIONED_SIDEBARS_DIR,
  CURRENT_VERSION_NAME,
} from './constants';

import {DEFAULT_PLUGIN_ID} from '@docusaurus/core/lib/constants';
import {LoadContext} from '@docusaurus/types';
import {normalizeUrl} from '@docusaurus/utils';

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

function ensureValidVersionString(version: unknown): asserts version is string {
  if (typeof version !== 'string') {
    throw new Error(
      `versions should be strings. Found type=[${typeof version}] for version=[${version}]`,
    );
  }
  // Should we forbid versions with special chars like / ?
  if (version.trim().length === 0) {
    throw new Error(`Invalid version=[${version}]`);
  }
}

function ensureValidVersionArray(
  versionArray: unknown,
): asserts versionArray is string[] {
  if (!(versionArray instanceof Array)) {
    throw new Error(
      `The versions file should contain an array of versions! ${JSON.stringify(
        versionArray,
      )}`,
    );
  }

  versionArray.forEach(ensureValidVersionString);
}

// TODO not easy to make async due to many deps
function readVersionsFile(siteDir: string, pluginId: string): string[] | null {
  const versionsFilePath = getVersionsFilePath(siteDir, pluginId);
  if (fs.existsSync(versionsFilePath)) {
    const content = JSON.parse(fs.readFileSync(versionsFilePath, 'utf8'));
    ensureValidVersionArray(content);
    return content;
  } else {
    return null;
  }
}

// TODO not easy to make async due to many deps
function readVersionNames(
  siteDir: string,
  options: Pick<
    PluginOptions,
    'id' | 'disableVersioning' | 'includeCurrentVersion'
  >,
): string[] {
  const versions = options.disableVersioning
    ? []
    : readVersionsFile(siteDir, options.id) ?? [];

  // We add the current version at the beginning, unless
  // - user don't want to
  // - it's been explicitly added to versions.json
  if (
    options.includeCurrentVersion &&
    !versions.includes(CURRENT_VERSION_NAME)
  ) {
    versions.unshift(CURRENT_VERSION_NAME);
  }

  if (versions.length === 0) {
    throw new Error(
      "It is not possible to use docs without any version. You shouldn't use 'includeCurrentVersion: false' on an unversioned site",
    );
  }

  return versions;
}

function getVersionMetadataPaths({
  versionName,
  context,
  options,
}: {
  versionName: string;
  context: Pick<LoadContext, 'siteDir'>;
  options: Pick<PluginOptions, 'id' | 'path' | 'sidebarPath'>;
}): Pick<VersionMetadata, 'docsDirPath' | 'sidebarFilePath'> {
  const isCurrentVersion = versionName === CURRENT_VERSION_NAME;

  const docsDirPath = isCurrentVersion
    ? path.resolve(context.siteDir, options.path)
    : path.join(
        getVersionedDocsDirPath(context.siteDir, options.id),
        `version-${versionName}`,
      );

  const sidebarFilePath = isCurrentVersion
    ? path.resolve(context.siteDir, options.sidebarPath)
    : path.join(
        getVersionedSidebarsDirPath(context.siteDir, options.id),
        `version-${versionName}-sidebars.json`,
      );

  return {docsDirPath, sidebarFilePath};
}

function createVersionMetadata({
  versionName,
  isLast,
  context,
  options,
}: {
  versionName: string;
  isLast: boolean;
  context: Pick<LoadContext, 'siteDir' | 'baseUrl'>;
  options: Pick<PluginOptions, 'id' | 'path' | 'sidebarPath' | 'routeBasePath'>;
}): VersionMetadata {
  const {sidebarFilePath, docsDirPath} = getVersionMetadataPaths({
    versionName,
    context,
    options,
  });

  // TODO hardcoded for retro-compatibility
  // TODO Need to make this configurable
  const versionLabel =
    versionName === CURRENT_VERSION_NAME ? 'Next' : versionName;
  const versionPathPart = isLast
    ? ''
    : versionName === CURRENT_VERSION_NAME
    ? 'next'
    : versionName;

  const versionPath = normalizeUrl([
    context.baseUrl,
    options.routeBasePath,
    versionPathPart,
  ]);

  // Because /docs/:route` should always be after `/docs/versionName/:route`.
  const routePriority = versionPathPart === '' ? -1 : undefined;

  return {
    versionName,
    versionLabel,
    versionPath,
    isLast,
    routePriority,
    sidebarFilePath,
    docsDirPath,
  };
}

function checkVersionMetadataPaths({
  versionName,
  docsDirPath,
  sidebarFilePath,
}: VersionMetadata) {
  if (!fs.existsSync(docsDirPath)) {
    throw new Error(
      `The docs folder does not exist for version [${versionName}]. A docs folder is expected to be found at ${docsDirPath}`,
    );
  }
  if (!fs.existsSync(sidebarFilePath)) {
    throw new Error(
      `The sidebar file does not exist for version [${versionName}]. A sidebar file is expected to be found at ${sidebarFilePath}`,
    );
  }
}

// TODO for retrocompatibility with existing behavior
// We should make this configurable
// "last version" is not a very good concept nor api surface
function getLastVersionName(versionNames: string[]) {
  if (versionNames.length === 1) {
    return versionNames[1];
  } else {
    return versionNames.filter(
      (versionName) => versionName !== CURRENT_VERSION_NAME,
    )[0];
  }
}

export function readVersionsMetadata({
  context,
  options,
}: {
  context: Pick<LoadContext, 'siteDir' | 'baseUrl'>;
  options: Pick<
    PluginOptions,
    | 'id'
    | 'path'
    | 'sidebarPath'
    | 'routeBasePath'
    | 'includeCurrentVersion'
    | 'disableVersioning'
  >;
}): VersionMetadata[] {
  const versionNames = readVersionNames(context.siteDir, options);
  const lastVersionName = getLastVersionName(versionNames);
  const versionsMetadata = versionNames.map((versionName) =>
    createVersionMetadata({
      versionName,
      isLast: versionName === lastVersionName,
      context,
      options,
    }),
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
    latestVersion: CURRENT_VERSION_NAME,
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
