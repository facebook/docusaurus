/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DefaultNavbarItem from './DefaultNavbarItem';
import {
  useVersions,
  useLatestVersion,
  useActiveDocContext,
} from '@theme/hooks/useDocs';

const versionLabel = (version) =>
  version.name === 'next' ? 'Next/Master' : version.name;

const getVersionMainDoc = (version) =>
  version.docs.find((doc) => doc.id === version.mainDocId);

export default function DocsVersionDropdownNavbarItem({
  docsPluginId,
  ...props
}) {
  const activeDocContext = useActiveDocContext(docsPluginId);
  const versions = useVersions(docsPluginId);
  const latestVersion = useLatestVersion(docsPluginId);

  const items = versions.map((version) => {
    // We try to link to the same doc, in another version
    // When not possible, fallback to the "main doc" of the version
    const versionDoc =
      activeDocContext?.alternateDocVersions[version.name] ||
      getVersionMainDoc(version);
    return {
      isNavLink: true,
      label: versionLabel(version),
      to: versionDoc.path,
      isActive: () => version === activeDocContext?.activeVersion,
    };
  });

  const dropdownVersion = activeDocContext.activeVersion ?? latestVersion;

  return (
    <DefaultNavbarItem
      {...props}
      label={versionLabel(dropdownVersion)}
      to={getVersionMainDoc(dropdownVersion).path}
      items={items}
    />
  );
}
