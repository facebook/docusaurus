/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import {
  useActivePlugin,
  useActiveVersion,
  useDocVersionSuggestions,
} from '@theme/hooks/useDocs';

const useMandatoryActiveDocsPluginId = () => {
  const activePlugin = useActivePlugin();
  if (!activePlugin) {
    throw new Error(
      'DocVersionCallout is only supposed to be used on docs-related routes',
    );
  }
  return activePlugin.pluginId;
};

const getVersionMainDoc = (version) =>
  version.docs.find((doc) => doc.id === version.mainDocId);

function DocVersionSuggestions(): JSX.Element {
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const pluginId = useMandatoryActiveDocsPluginId();
  const activeVersion = useActiveVersion(pluginId);
  const {
    latestDocSuggestion,
    latestVersionSuggestion,
  } = useDocVersionSuggestions(pluginId);

  // No suggestion to be made
  if (!latestVersionSuggestion) {
    return <></>;
  }

  const activeVersionName = activeVersion.name;

  // try to link to same doc in latest version (not always possible)
  // fallback to main doc of latest version
  const suggestedDoc =
    latestDocSuggestion ?? getVersionMainDoc(latestVersionSuggestion);

  return (
    <div className="alert alert--warning margin-bottom--md" role="alert">
      {activeVersionName === 'next' ? (
        <div>
          This is unreleased documentation for {siteTitle}{' '}
          <strong>{activeVersionName}</strong> version.
        </div>
      ) : (
        <div>
          This is documentation for {siteTitle}{' '}
          <strong>v{activeVersionName}</strong>, which is no longer actively
          maintained.
        </div>
      )}
      <div className="margin-top--md">
        For up-to-date documentation, see the{' '}
        <strong>
          <Link to={suggestedDoc.path}>latest version</Link>
        </strong>
        ({latestVersionSuggestion.name}).
      </div>
    </div>
  );
}

export default DocVersionSuggestions;
