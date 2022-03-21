/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import type {VersionMetadata} from './types';
import {
  VERSIONS_JSON_FILE,
  VERSIONED_DOCS_DIR,
  VERSIONED_SIDEBARS_DIR,
  CURRENT_VERSION_NAME,
} from './constants';
import type {
  PluginOptions,
  VersionBanner,
  VersionOptions,
  VersionsOptions,
} from '@docusaurus/plugin-content-docs';

import type {LoadContext} from '@docusaurus/types';
import {
  getPluginI18nPath,
  normalizeUrl,
  posixPath,
  DEFAULT_PLUGIN_ID,
} from '@docusaurus/utils';
import _ from 'lodash';
import {resolveSidebarPathOption} from './sidebars';

// retro-compatibility: no prefix for the default plugin id
function addPluginIdPrefix(fileOrDir: string, pluginId: string): string {
  return pluginId === DEFAULT_PLUGIN_ID
    ? fileOrDir
    : `${pluginId}_${fileOrDir}`;
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
      `Versions should be strings. Found type "${typeof version}" for version "${version}".`,
    );
  }
  // Should we forbid versions with special chars like / ?
  if (version.trim().length === 0) {
    throw new Error(`Invalid version "${version}".`);
  }
}

function ensureValidVersionArray(
  versionArray: unknown,
): asserts versionArray is string[] {
  if (!Array.isArray(versionArray)) {
    throw new Error(
      `The versions file should contain an array of version names! Found content: ${JSON.stringify(
        versionArray,
      )}`,
    );
  }

  versionArray.forEach(ensureValidVersionString);
}

export async function readVersionsFile(
  siteDir: string,
  pluginId: string,
): Promise<string[] | null> {
  const versionsFilePath = getVersionsFilePath(siteDir, pluginId);
  if (await fs.pathExists(versionsFilePath)) {
    const content = JSON.parse(await fs.readFile(versionsFilePath, 'utf8'));
    ensureValidVersionArray(content);
    return content;
  }
  return null;
}

export async function readVersionNames(
  siteDir: string,
  options: Pick<
    PluginOptions,
    'id' | 'disableVersioning' | 'includeCurrentVersion'
  >,
): Promise<string[]> {
  const versionFileContent = await readVersionsFile(siteDir, options.id);

  if (!versionFileContent && options.disableVersioning) {
    throw new Error(
      `Docs: using "disableVersioning: ${options.disableVersioning}" option on a non-versioned site does not make sense.`,
    );
  }

  const versions = options.disableVersioning ? [] : versionFileContent ?? [];

  // We add the current version at the beginning, unless:
  // - user don't want to; or
  // - it's already been explicitly added to versions.json
  if (
    options.includeCurrentVersion &&
    !versions.includes(CURRENT_VERSION_NAME)
  ) {
    versions.unshift(CURRENT_VERSION_NAME);
  }

  if (versions.length === 0) {
    throw new Error(
      `It is not possible to use docs without any version. Please check the configuration of these options: "includeCurrentVersion: ${options.includeCurrentVersion}", "disableVersioning: ${options.disableVersioning}".`,
    );
  }

  return versions;
}

function getDocsDirPathLocalized({
  siteDir,
  locale,
  pluginId,
  versionName,
}: {
  siteDir: string;
  locale: string;
  pluginId: string;
  versionName: string;
}) {
  return getPluginI18nPath({
    siteDir,
    locale,
    pluginName: 'docusaurus-plugin-content-docs',
    pluginId,
    subPaths: [
      versionName === CURRENT_VERSION_NAME
        ? CURRENT_VERSION_NAME
        : `version-${versionName}`,
    ],
  });
}

function getVersionMetadataPaths({
  versionName,
  context,
  options,
}: {
  versionName: string;
  context: Pick<LoadContext, 'siteDir' | 'i18n'>;
  options: Pick<PluginOptions, 'id' | 'path' | 'sidebarPath'>;
}): Pick<
  VersionMetadata,
  'contentPath' | 'contentPathLocalized' | 'sidebarFilePath'
> {
  const isCurrentVersion = versionName === CURRENT_VERSION_NAME;

  const contentPathLocalized = getDocsDirPathLocalized({
    siteDir: context.siteDir,
    locale: context.i18n.currentLocale,
    pluginId: options.id,
    versionName,
  });

  if (isCurrentVersion) {
    return {
      contentPath: path.resolve(context.siteDir, options.path),
      contentPathLocalized,
      sidebarFilePath: resolveSidebarPathOption(
        context.siteDir,
        options.sidebarPath,
      ),
    };
  }

  return {
    contentPath: path.join(
      getVersionedDocsDirPath(context.siteDir, options.id),
      `version-${versionName}`,
    ),
    contentPathLocalized,
    sidebarFilePath: path.join(
      getVersionedSidebarsDirPath(context.siteDir, options.id),
      `version-${versionName}-sidebars.json`,
    ),
  };
}

function getVersionEditUrls({
  contentPath,
  contentPathLocalized,
  context: {siteDir, i18n},
  options: {id, path: currentVersionPath, editUrl, editCurrentVersion},
}: {
  contentPath: string;
  contentPathLocalized: string;
  context: Pick<LoadContext, 'siteDir' | 'i18n'>;
  options: Pick<
    PluginOptions,
    'id' | 'path' | 'editUrl' | 'editCurrentVersion'
  >;
}): {versionEditUrl: string; versionEditUrlLocalized: string} | undefined {
  if (!editUrl) {
    return undefined;
  }

  // if the user is using the functional form of editUrl,
  // he has total freedom and we can't compute a "version edit url"
  if (typeof editUrl === 'function') {
    return undefined;
  }

  const editDirPath = editCurrentVersion ? currentVersionPath : contentPath;
  const editDirPathLocalized = editCurrentVersion
    ? getDocsDirPathLocalized({
        siteDir,
        locale: i18n.currentLocale,
        versionName: CURRENT_VERSION_NAME,
        pluginId: id,
      })
    : contentPathLocalized;

  const versionPathSegment = posixPath(
    path.relative(siteDir, path.resolve(siteDir, editDirPath)),
  );
  const versionPathSegmentLocalized = posixPath(
    path.relative(siteDir, path.resolve(siteDir, editDirPathLocalized)),
  );

  const versionEditUrl = normalizeUrl([editUrl, versionPathSegment]);

  const versionEditUrlLocalized = normalizeUrl([
    editUrl,
    versionPathSegmentLocalized,
  ]);

  return {
    versionEditUrl,
    versionEditUrlLocalized,
  };
}

export function getDefaultVersionBanner({
  versionName,
  versionNames,
  lastVersionName,
}: {
  versionName: string;
  versionNames: string[];
  lastVersionName: string;
}): VersionBanner | null {
  // Current version: good, no banner
  if (versionName === lastVersionName) {
    return null;
  }
  // Upcoming versions: unreleased banner
  if (
    versionNames.indexOf(versionName) < versionNames.indexOf(lastVersionName)
  ) {
    return 'unreleased';
  }
  // Older versions: display unmaintained banner
  return 'unmaintained';
}

export function getVersionBanner({
  versionName,
  versionNames,
  lastVersionName,
  options,
}: {
  versionName: string;
  versionNames: string[];
  lastVersionName: string;
  options: Pick<PluginOptions, 'versions'>;
}): VersionBanner | null {
  const versionBannerOption = options.versions[versionName]?.banner;
  if (versionBannerOption) {
    return versionBannerOption === 'none' ? null : versionBannerOption;
  }
  return getDefaultVersionBanner({
    versionName,
    versionNames,
    lastVersionName,
  });
}

export function getVersionBadge({
  versionName,
  versionNames,
  options,
}: {
  versionName: string;
  versionNames: string[];
  options: Pick<PluginOptions, 'versions'>;
}): boolean {
  const versionBadgeOption = options.versions[versionName]?.badge;
  // If site is not versioned or only one version is included
  // we don't show the version badge by default
  // See https://github.com/facebook/docusaurus/issues/3362
  const versionBadgeDefault = versionNames.length !== 1;
  return versionBadgeOption ?? versionBadgeDefault;
}

function getVersionClassName({
  versionName,
  options,
}: {
  versionName: string;
  options: Pick<PluginOptions, 'versions'>;
}): string {
  const versionClassNameOption = options.versions[versionName]?.className;
  const versionClassNameDefault = `docs-version-${versionName}`;
  return versionClassNameOption ?? versionClassNameDefault;
}

function createVersionMetadata({
  versionName,
  versionNames,
  lastVersionName,
  context,
  options,
}: {
  versionName: string;
  versionNames: string[];
  lastVersionName: string;
  context: Pick<LoadContext, 'siteDir' | 'baseUrl' | 'i18n'>;
  options: Pick<
    PluginOptions,
    | 'id'
    | 'path'
    | 'sidebarPath'
    | 'routeBasePath'
    | 'tagsBasePath'
    | 'versions'
    | 'editUrl'
    | 'editCurrentVersion'
  >;
}): VersionMetadata {
  const {sidebarFilePath, contentPath, contentPathLocalized} =
    getVersionMetadataPaths({versionName, context, options});

  const isLast = versionName === lastVersionName;

  // retro-compatible values
  const defaultVersionLabel =
    versionName === CURRENT_VERSION_NAME ? 'Next' : versionName;
  function getDefaultVersionPathPart() {
    if (isLast) {
      return '';
    }
    return versionName === CURRENT_VERSION_NAME ? 'next' : versionName;
  }
  const defaultVersionPathPart = getDefaultVersionPathPart();

  const versionOptions: VersionOptions = options.versions[versionName] ?? {};

  const versionLabel = versionOptions.label ?? defaultVersionLabel;
  const versionPathPart = versionOptions.path ?? defaultVersionPathPart;

  const versionPath = normalizeUrl([
    context.baseUrl,
    options.routeBasePath,
    versionPathPart,
  ]);

  const versionEditUrls = getVersionEditUrls({
    contentPath,
    contentPathLocalized,
    context,
    options,
  });

  // Because /docs/:route` should always be after `/docs/versionName/:route`.
  const routePriority = versionPathPart === '' ? -1 : undefined;

  // the path that will be used to refer the docs tags
  // example below will be using /docs/tags
  const tagsPath = normalizeUrl([versionPath, options.tagsBasePath]);

  return {
    versionName,
    versionLabel,
    versionPath,
    tagsPath,
    versionEditUrl: versionEditUrls?.versionEditUrl,
    versionEditUrlLocalized: versionEditUrls?.versionEditUrlLocalized,
    versionBanner: getVersionBanner({
      versionName,
      versionNames,
      lastVersionName,
      options,
    }),
    versionBadge: getVersionBadge({versionName, versionNames, options}),
    versionClassName: getVersionClassName({versionName, options}),
    isLast,
    routePriority,
    sidebarFilePath,
    contentPath,
    contentPathLocalized,
  };
}

async function checkVersionMetadataPaths({
  versionMetadata,
  context,
}: {
  versionMetadata: VersionMetadata;
  context: Pick<LoadContext, 'siteDir'>;
}) {
  const {versionName, contentPath, sidebarFilePath} = versionMetadata;
  const {siteDir} = context;
  const isCurrentVersion = versionName === CURRENT_VERSION_NAME;

  if (!(await fs.pathExists(contentPath))) {
    throw new Error(
      `The docs folder does not exist for version "${versionName}". A docs folder is expected to be found at ${path.relative(
        siteDir,
        contentPath,
      )}.`,
    );
  }

  // If the current version defines a path to a sidebar file that does not
  // exist, we throw! Note: for versioned sidebars, the file may not exist (as
  // we prefer to not create it rather than to create an empty file)
  // See https://github.com/facebook/docusaurus/issues/3366
  // See https://github.com/facebook/docusaurus/pull/4775
  if (
    isCurrentVersion &&
    typeof sidebarFilePath === 'string' &&
    !(await fs.pathExists(sidebarFilePath))
  ) {
    throw new Error(`The path to the sidebar file does not exist at "${path.relative(
      siteDir,
      sidebarFilePath,
    )}".
Please set the docs "sidebarPath" field in your config file to:
- a sidebars path that exists
- false: to disable the sidebar
- undefined: for Docusaurus to generate it automatically`);
  }
}

// TODO for retrocompatibility with existing behavior
// We should make this configurable
// "last version" is not a very good concept nor api surface
function getDefaultLastVersionName(versionNames: string[]) {
  if (versionNames.length === 1) {
    return versionNames[0]!;
  }
  return versionNames.filter(
    (versionName) => versionName !== CURRENT_VERSION_NAME,
  )[0]!;
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
      `Docs option lastVersion: ${options.lastVersion} is invalid. ${availableVersionNamesMsg}`,
    );
  }
  const unknownVersionConfigNames = _.difference(
    Object.keys(options.versions),
    availableVersionNames,
  );
  if (unknownVersionConfigNames.length > 0) {
    throw new Error(
      `Invalid docs option "versions": unknown versions (${unknownVersionConfigNames.join(
        ',',
      )}) found. ${availableVersionNamesMsg}`,
    );
  }

  if (options.onlyIncludeVersions) {
    if (options.onlyIncludeVersions.length === 0) {
      throw new Error(
        `Invalid docs option "onlyIncludeVersions": an empty array is not allowed, at least one version is needed.`,
      );
    }
    const unknownOnlyIncludeVersionNames = _.difference(
      options.onlyIncludeVersions,
      availableVersionNames,
    );
    if (unknownOnlyIncludeVersionNames.length > 0) {
      throw new Error(
        `Invalid docs option "onlyIncludeVersions": unknown versions (${unknownOnlyIncludeVersionNames.join(
          ',',
        )}) found. ${availableVersionNamesMsg}`,
      );
    }
    if (
      options.lastVersion &&
      !options.onlyIncludeVersions.includes(options.lastVersion)
    ) {
      throw new Error(
        `Invalid docs option "lastVersion": if you use both the "onlyIncludeVersions" and "lastVersion" options, then "lastVersion" must be present in the provided "onlyIncludeVersions" array.`,
      );
    }
  }
}

/**
 * Filter versions according to provided options.
 * Note: we preserve the order in which versions are provided;
 * the order of the onlyIncludeVersions array does not matter
 */
export function filterVersions(
  versionNamesUnfiltered: string[],
  options: Pick<PluginOptions, 'onlyIncludeVersions'>,
): string[] {
  if (options.onlyIncludeVersions) {
    return versionNamesUnfiltered.filter((name) =>
      options.onlyIncludeVersions!.includes(name),
    );
  }
  return versionNamesUnfiltered;
}

export async function readVersionsMetadata({
  context,
  options,
}: {
  context: Pick<LoadContext, 'siteDir' | 'baseUrl' | 'i18n'>;
  options: Pick<
    PluginOptions,
    | 'id'
    | 'path'
    | 'sidebarPath'
    | 'routeBasePath'
    | 'tagsBasePath'
    | 'includeCurrentVersion'
    | 'disableVersioning'
    | 'lastVersion'
    | 'versions'
    | 'onlyIncludeVersions'
    | 'editUrl'
    | 'editCurrentVersion'
  >;
}): Promise<VersionMetadata[]> {
  const versionNamesUnfiltered = await readVersionNames(
    context.siteDir,
    options,
  );

  checkVersionsOptions(versionNamesUnfiltered, options);

  const versionNames = filterVersions(versionNamesUnfiltered, options);

  const lastVersionName =
    options.lastVersion ?? getDefaultLastVersionName(versionNames);

  const versionsMetadata = versionNames.map((versionName) =>
    createVersionMetadata({
      versionName,
      versionNames,
      lastVersionName,
      context,
      options,
    }),
  );
  await Promise.all(
    versionsMetadata.map((versionMetadata) =>
      checkVersionMetadataPaths({versionMetadata, context}),
    ),
  );
  return versionsMetadata;
}

// order matter!
// Read in priority the localized path, then the unlocalized one
// We want the localized doc to "override" the unlocalized one
export function getDocsDirPaths(
  versionMetadata: Pick<
    VersionMetadata,
    'contentPath' | 'contentPathLocalized'
  >,
): [string, string] {
  return [versionMetadata.contentPathLocalized, versionMetadata.contentPath];
}
