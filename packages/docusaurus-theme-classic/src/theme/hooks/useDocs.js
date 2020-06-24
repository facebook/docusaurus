/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useMemo} from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {matchPath, useLocation} from '@docusaurus/router';

const DefaultDocsPluginPath = 'docs';

const useDocsGlobalData = (docsPluginPath = DefaultDocsPluginPath) => {
  const {globalData} = useDocusaurusContext();
  const docsData = globalData['docusaurus-plugin-content-docs'];
  if (!docsData) {
    throw new Error('no docs plugin global data could be found');
  }
  const docsPluginInstanceData = docsData[docsPluginPath];
  if (!docsPluginInstanceData) {
    throw new Error(
      `no docs global data could be found for instance with path=[${docsPluginPath}]`,
    );
  }
  return docsPluginInstanceData;
};

// Note: return undefined on doc-unrelated pages!
export const useDocsActiveVersionMetadata = (
  docsPluginPath = DefaultDocsPluginPath,
) => {
  const {versionsMetadata} = useDocsGlobalData(docsPluginPath);
  const {pathname} = useLocation();
  return useMemo(() => {
    return versionsMetadata.find((versionMetadata) => {
      return !!matchPath(pathname, {
        path: versionMetadata.path,
        exact: false,
        strict: false,
      });
    });
  }, [docsPluginPath, versionsMetadata, pathname]);
};

const findAlternateDocVersions = ({
  latestVersion,
  pathname,
  activeVersionMetadata,
  versionsMetadata,
}) => {
  if (!activeVersionMetadata) {
    return null;
  }

  // We match the docs by their urls suffixes (let's call it "slug")
  // Not taking the pluginPath/version into consideration
  //
  // IE these all match:
  // - /docs/v1/docSlug
  // - /docs/v2/docSlug
  // - /docs/docSlug
  // - /docs/next/docSlug
  //
  // For now we don't have a good way to match docs when their slugs change
  const docSlug = pathname.replace(activeVersionMetadata.path, '');
  const isAlternateDocVersion = (alternateVersionMetadata, alternateDocPath) =>
    alternateDocPath.replace(alternateVersionMetadata.path, '') === docSlug;

  // Exclude current version from returned alternates
  const alternateVersionsMetadata = versionsMetadata.filter(
    (v) => v !== activeVersionMetadata,
  );

  const alternateDocs = alternateVersionsMetadata.map(
    (alternateVersionMetadata) => {
      const alternateDocPath = alternateVersionMetadata.docsPaths.find(
        (alternateDocPath) =>
          isAlternateDocVersion(alternateVersionMetadata, alternateDocPath),
      );
      if (!alternateDocPath) {
        return null;
      }
      return {
        version: alternateVersionMetadata.version,
        isLatest: alternateVersionMetadata.version === latestVersion,
        path: alternateDocPath,
      };
    },
  );

  // Useful to return the version alternates too
  // if no doc match, the UI may want to link to a doc version's homepage
  const alternateVersions = alternateVersionsMetadata.map(
    (alternateVersionMetadata) => ({
      version: alternateVersionMetadata.version,
      isLatest: alternateVersionMetadata.version === latestVersion,
      path: alternateVersionMetadata.path,
    }),
  );

  const latestAlternateDoc = alternateDocs.find((d) => d.isLatest);
  const latestAlternateVersion = alternateDocs.find((d) => d.isLatest);

  return {
    alternateDocs,
    alternateVersions,
    latestAlternateDoc,
    latestAlternateVersion,
  };
};

export const useActiveDocAlternateVersions = (
  docsPluginPath = DefaultDocsPluginPath,
) => {
  const {pathname} = useLocation();
  const {latestVersion, versionsMetadata} = useDocsGlobalData(docsPluginPath);
  const activeVersionMetadata = useDocsActiveVersionMetadata(docsPluginPath);
  return useMemo(() => {
    return findAlternateDocVersions({
      latestVersion,
      pathname,
      versionsMetadata,
      activeVersionMetadata,
    });
  }, [pathname, versionsMetadata, activeVersionMetadata]);
};
