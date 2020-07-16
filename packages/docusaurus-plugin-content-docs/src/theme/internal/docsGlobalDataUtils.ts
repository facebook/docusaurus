/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {matchPath} from '@docusaurus/router';

import {
  GlobalPluginData,
  GlobalVersionMetadata,
  GlobalVersionDocMetadata,
} from '../../types';

// Short/convenient type aliases
type Version = GlobalVersionMetadata;
type Doc = GlobalVersionDocMetadata;

export const createDocsDataUtils = (instance: GlobalPluginData) => {
  const {versions, latestVersionName} = instance;

  const getLatestVersion = (): Version => {
    return versions.find((version) => version.name === latestVersionName)!;
  };

  // Note: return undefined on doc-unrelated pages,
  // because there's no version currently considered as active
  const getActiveVersion = (pathname: string): Version | undefined => {
    const lastVersion = getLatestVersion();
    // Last version is a route like /docs/*,
    // we need to try to match it last or it would match /docs/version-1.0/* as well
    const orderedVersionsMetadata = [
      ...versions.filter((version) => version !== lastVersion),
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

  const getActiveDocContext = (pathname: string): ActiveDocContext => {
    const activeVersion = getActiveVersion(pathname);
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
      versions.forEach((version) => {
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

  return {getLatestVersion, getActiveVersion, getActiveDocContext} as const;
};

type ActiveDocContext = {
  activeVersion?: Version;
  activeDoc?: Doc;
  alternateDocVersions: Record<string, Doc>;
};
