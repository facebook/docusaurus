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
import type {Props} from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

const getVersionMainDoc = (version) =>
  version.docs.find((doc) => doc.id === version.mainDocId);

export default function DocsVersionDropdownNavbarItem({
  mobile,
  docsPluginId,
  dropdownActiveClassDisabled,
  dropdownItemsBefore,
  dropdownItemsAfter,
  ...props
}: Props): JSX.Element {
  const activeDocContext = useActiveDocContext(docsPluginId);
  const versions = useVersions(docsPluginId);
  const latestVersion = useLatestVersion(docsPluginId);

  function getItems() {
    const versionLinks = versions.map((version) => {
      // We try to link to the same doc, in another version
      // When not possible, fallback to the "main doc" of the version
      const versionDoc =
        activeDocContext?.alternateDocVersions[version.name] ||
        getVersionMainDoc(version);
      return {
        isNavLink: true,
        label: version.label,
        to: versionDoc.path,
        isActive: () => version === activeDocContext?.activeVersion,
      };
    });

    const items = [
      ...dropdownItemsBefore,
      ...versionLinks,
      ...dropdownItemsAfter,
    ];

    // We don't want to render a version dropdown with 0 or 1 item
    // If we build the site with a single docs version (onlyIncludeVersions: ['1.0.0'])
    // We'd rather render a buttonb instead of a dropdown
    if (items.length <= 1) {
      return undefined;
    }

    return items;
  }

  const dropdownVersion = activeDocContext.activeVersion ?? latestVersion;

  // Mobile is handled a bit differently
  const dropdownLabel = mobile ? 'Versions' : dropdownVersion.label;
  const dropdownTo = mobile
    ? undefined
    : getVersionMainDoc(dropdownVersion).path;

  return (
    <DefaultNavbarItem
      {...props}
      mobile={mobile}
      label={dropdownLabel}
      to={dropdownTo}
      items={getItems()}
      isActive={dropdownActiveClassDisabled ? () => false : undefined}
    />
  );
}
