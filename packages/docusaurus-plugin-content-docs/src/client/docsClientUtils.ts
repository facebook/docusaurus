/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {matchPath} from '@docusaurus/router';

import {GlobalPluginData, GlobalVersion, GlobalDoc} from '../types';

// This code is not part of the api surface, not in ./theme on purpose

// Short/convenient type aliases
type Version = GlobalVersion;
type Doc = GlobalDoc;

export type ActivePlugin = {
  pluginId: string;
  pluginData: GlobalPluginData;
};

export type GetActivePluginOptions = {failfast?: boolean}; // use fail-fast option if you know for sure one plugin instance is active

// get the data of the plugin that is currently "active"
// ie the docs of that plugin are currently browsed
// it is useful to support multiple docs plugin instances
export function getActivePlugin(
  allPluginDatas: Record<string, GlobalPluginData>,
  pathname: string,
  options: GetActivePluginOptions = {},
): ActivePlugin | undefined {
  const activeEntry = Object.entries(allPluginDatas).find(
    ([_id, pluginData]) =>
      !!matchPath(pathname, {
        path: pluginData.path,
        exact: false,
        strict: false,
      }),
  );

  const activePlugin: ActivePlugin | undefined = activeEntry
    ? {pluginId: activeEntry[0], pluginData: activeEntry[1]}
    : undefined;

  if (!activePlugin && options.failfast) {
    throw new Error(
      `Can't find active docs plugin for "${pathname}" pathname, while it was expected to be found. Maybe you tried to use a docs feature that can only be used on a docs-related page? Existing docs plugin paths are: ${Object.values(
        allPluginDatas,
      )
        .map((plugin) => plugin.path)
        .join(', ')}`,
    );
  }

  return activePlugin;
}

export type ActiveDocContext = {
  activeVersion?: Version;
  activeDoc?: Doc;
  alternateDocVersions: Record<string, Doc>;
};

export const getLatestVersion = (data: GlobalPluginData): Version =>
  data.versions.find((version) => version.isLast)!;

// Note: return undefined on doc-unrelated pages,
// because there's no version currently considered as active
export const getActiveVersion = (
  data: GlobalPluginData,
  pathname: string,
): Version | undefined => {
  const lastVersion = getLatestVersion(data);
  // Last version is a route like /docs/*,
  // we need to try to match it last or it would match /docs/version-1.0/* as well
  const orderedVersionsMetadata = [
    ...data.versions.filter((version) => version !== lastVersion),
    lastVersion,
  ];
  return orderedVersionsMetadata.find(
    (version) =>
      !!matchPath(pathname, {
        path: version.path,
        exact: false,
        strict: false,
      }),
  );
};

export const getActiveDocContext = (
  data: GlobalPluginData,
  pathname: string,
): ActiveDocContext => {
  const activeVersion = getActiveVersion(data, pathname);
  const activeDoc = activeVersion?.docs.find(
    (doc) =>
      !!matchPath(pathname, {
        path: doc.path,
        exact: true,
        strict: false,
      }),
  );

  function getAlternateVersionDocs(
    docId: string,
  ): ActiveDocContext['alternateDocVersions'] {
    const result: ActiveDocContext['alternateDocVersions'] = {};
    data.versions.forEach((version) => {
      version.docs.forEach((doc) => {
        if (doc.id === docId) {
          result[version.name] = doc;
        }
      });
    });
    return result;
  }

  const alternateVersionDocs = activeDoc
    ? getAlternateVersionDocs(activeDoc.id)
    : {};

  return {
    activeVersion,
    activeDoc,
    alternateDocVersions: alternateVersionDocs,
  };
};

export type DocVersionSuggestions = {
  // suggest the latest version
  latestVersionSuggestion: GlobalVersion;
  // suggest the same doc, in latest version (if exist)
  latestDocSuggestion?: GlobalDoc;
};

export const getDocVersionSuggestions = (
  data: GlobalPluginData,
  pathname: string,
): DocVersionSuggestions => {
  const latestVersion = getLatestVersion(data);
  const activeDocContext = getActiveDocContext(data, pathname);
  const latestDocSuggestion: GlobalDoc | undefined =
    activeDocContext?.alternateDocVersions[latestVersion.name];
  return {latestDocSuggestion, latestVersionSuggestion: latestVersion};
};
