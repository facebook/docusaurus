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
  version.name === 'next' ? 'Next' : version.name;

const dropdownLabel = (label, version) => `${label}: ${versionLabel(version)}`;

const getVersionMainDoc = (version) =>
  version.docs.find((doc) => doc.id === version.mainDocId);

// When we are on /docs/*
function ActiveVersionsDropdown({activeDocContext, label, position}) {
  const versions = useVersions();
  console.log('activeDocContext', activeDocContext);
  const {activeVersion, alternateDocVersions} = activeDocContext;
  const items = versions.map((version) => {
    // We try to link to the same doc, in another version
    // but if there's no similar not in another version,
    // we fallback to the "main doc" (home/first doc of the version)
    const doc =
      alternateDocVersions[version.name] || getVersionMainDoc(version);
    return {
      isNavLink: true,
      label: versionLabel(version),
      to: doc.path,
      isActive: () => version === activeVersion,
    };
  });
  return (
    <DefaultNavbarItem
      position={position}
      label={dropdownLabel(label, activeVersion)}
      to={activeVersion.path}
      items={items}
    />
  );
}

// When we are on non-docs pages (like homepage, or /blog)
function InactiveVersionsDropdown({label, position}) {
  const versions = useVersions();
  const latestVersion = useLatestVersion();
  const items = versions.map((version) => {
    return {
      isNavLink: true,
      label: versionLabel(version),
      to: version.path,
    };
  });
  return (
    <DefaultNavbarItem
      position={position}
      label={dropdownLabel(label, latestVersion)}
      to={latestVersion.path}
      items={items}
    />
  );
}

export default function DocsVersionDropdownNavbarItem(props) {
  const activeDocContext = useActiveDocContext(props.instancePath);
  return activeDocContext && activeDocContext.activeVersion ? (
    <ActiveVersionsDropdown activeDocContext={activeDocContext} {...props} />
  ) : (
    <InactiveVersionsDropdown {...props} />
  );
}
