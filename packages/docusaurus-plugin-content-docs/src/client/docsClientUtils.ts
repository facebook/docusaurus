/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import usePluginGlobalData from '@docusaurus/usePluginGlobalData';
import {matchPath} from '@docusaurus/router';

import {
  GlobalPluginData,
  GlobalVersionMetadata,
  GlobalVersionDocMetadata,
} from '../types';

// This code is not part of the api surface, not in ./theme on purpose

// Short/convenient type aliases
type Version = GlobalVersionMetadata;
type Doc = GlobalVersionDocMetadata;

export type ActiveDocContext = {
  activeVersion?: Version;
  activeDoc?: Doc;
  alternateDocVersions: Record<string, Doc>;
};

export const useDocsPluginData = (docsPluginId: string | undefined) =>
  usePluginGlobalData('docusaurus-plugin-content-docs', docsPluginId);

export const getLatestVersion = (data: GlobalPluginData): Version => {
  return data.versions.find(
    (version) => version.name === data.latestVersionName,
  )!;
};

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
  return orderedVersionsMetadata.find((version) => {
    return !!matchPath(pathname, {
      path: version.path,
      exact: false,
      strict: false,
    });
  });
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
          result[version.name!] = doc;
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
