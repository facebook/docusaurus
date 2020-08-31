/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {
  PluginOptions,
  VersionMetadata,
  VersionOptions,
  VersionsOptions,
} from './types';
import {
  VERSIONS_JSON_FILE,
  VERSIONED_DOCS_DIR,
  VERSIONED_SIDEBARS_DIR,
  CURRENT_VERSION_NAME,
} from './constants';

import {DEFAULT_PLUGIN_ID} from '@docusaurus/core/lib/constants';
import {LoadContext} from '@docusaurus/types';
import {normalizeUrl} from '@docusaurus/utils';
import {difference} from 'lodash';

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
      `The versions file should contain an array of versions! Found content=${JSON.stringify(
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
  const versionFileContent = readVersionsFile(siteDir, options.id);

  if (!versionFileContent && options.disableVersioning) {
    throw new Error(
      `Docs: using disableVersioning=${options.disableVersioning} option on a non-versioned site does not make sense`,
    );
  }

  const versions = options.disableVersioning ? [] : versionFileContent ?? [];

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
      `It is not possible to use docs without any version. Please check the configuration of these options: includeCurrentVersion=${options.includeCurrentVersion} disableVersioning=${options.disableVersioning}`,
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
  options: Pick<
    PluginOptions,
    'id' | 'path' | 'sidebarPath' | 'routeBasePath' | 'versions'
  >;
}): VersionMetadata {
  const {sidebarFilePath, docsDirPath} = getVersionMetadataPaths({
    versionName,
    context,
    options,
  });

  // retro-compatible values
  const defaultVersionLabel =
    versionName === CURRENT_VERSION_NAME ? 'Next' : versionName;
  const defaultVersionPathPart = isLast
    ? ''
    : versionName === CURRENT_VERSION_NAME
    ? 'next'
    : versionName;

  const versionOptions: VersionOptions = options.versions[versionName] ?? {};

  const versionLabel = versionOptions.label ?? defaultVersionLabel;
  const versionPathPart = versionOptions.path ?? defaultVersionPathPart;

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
function getDefaultLastVersionName(versionNames: string[]) {
  if (versionNames.length === 1) {
    return versionNames[0];
  } else {
    return versionNames.filter(
      (versionName) => versionName !== CURRENT_VERSION_NAME,
    )[0];
  }
}

function checkVersionsOptions(
  availableVersionNames: string[],
  options: VersionsOptions,
) {
  const availableVersionNamesMsg = `Available version names are: ${availableVersionNames.join(
    ', ',
  )}`;
  if (
    options.lastVersion &&
    !availableVersionNames.includes(options.lastVersion)
  ) {
    throw new Error(
      `Docs option lastVersion=${options.lastVersion} is invalid. ${availableVersionNamesMsg}`,
    );
  }
  const unknownVersionConfigNames = difference(
    Object.keys(options.versions),
    availableVersionNames,
  );
  if (unknownVersionConfigNames.length > 0) {
    throw new Error(
      `Bad docs options.versions: unknown versions found: ${unknownVersionConfigNames.join(
        ',',
      )}. ${availableVersionNamesMsg}`,
    );
  }

  if (options.onlyIncludeVersions) {
    if (options.onlyIncludeVersions.length === 0) {
      throw new Error(
        `Bad docs options.onlyIncludeVersions: an empty array is not allowed, at least one version is needed`,
      );
    }
    const unknownOnlyIncludeVersionNames = difference(
      options.onlyIncludeVersions,
      availableVersionNames,
    );
    if (unknownOnlyIncludeVersionNames.length > 0) {
      throw new Error(
        `Bad docs options.onlyIncludeVersions: unknown versions found: ${unknownOnlyIncludeVersionNames.join(
          ',',
        )}. ${unknownOnlyIncludeVersionNames}`,
      );
    }
    if (
      options.lastVersion &&
      !options.onlyIncludeVersions.includes(options.lastVersion)
    ) {
      throw new Error(
        `Bad docs options.lastVersion: if you use both the onlyIncludeVersions and lastVersion options, then lastVersion must be present in the provided onlyIncludeVersions array`,
      );
    }
  }
}

// Filter versions according to provided options
// Note: we preserve the order in which versions are provided
// the order of the onlyIncludeVersions array does not matter
function filterVersions(
  versionNamesUnfiltered: string[],
  options: Pick<PluginOptions, 'onlyIncludeVersions'>,
) {
  if (options.onlyIncludeVersions) {
    return versionNamesUnfiltered.filter((name) =>
      options.onlyIncludeVersions!.includes(name),
    );
  } else {
    return versionNamesUnfiltered;
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
    | 'lastVersion'
    | 'versions'
    | 'onlyIncludeVersions'
  >;
}): VersionMetadata[] {
  const versionNamesUnfiltered = readVersionNames(context.siteDir, options);

  checkVersionsOptions(versionNamesUnfiltered, options);

  const versionNames = filterVersions(versionNamesUnfiltered, options);

  const lastVersionName =
    options.lastVersion ?? getDefaultLastVersionName(versionNames);

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
