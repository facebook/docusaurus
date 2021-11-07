/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import {
  useVersions,
  useLatestVersion,
  useActiveDocContext,
} from '@theme/hooks/useDocs';
import type {Props} from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
import {useDocsPreferredVersion} from '@docusaurus/theme-common';
import {translate} from '@docusaurus/Translate';
import type {GlobalDataVersion} from '@docusaurus/plugin-content-docs-types';

const getVersionMainDoc = (version: GlobalDataVersion) =>
  version.docs.find((doc) => doc.id === version.mainDocId)!;

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

  const {preferredVersion, savePreferredVersionName} =
    useDocsPreferredVersion(docsPluginId);

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
        onClick: () => {
          savePreferredVersionName(version.name);
        },
      };
    });

    return [...dropdownItemsBefore, ...versionLinks, ...dropdownItemsAfter];
  }

  const items = getItems();

  const dropdownVersion =
    activeDocContext.activeVersion ?? preferredVersion ?? latestVersion;

  // Mobile dropdown is handled a bit differently
  const dropdownLabel =
    mobile && items
      ? translate({
          id: 'theme.navbar.mobileVersionsDropdown.label',
          message: 'Versions',
          description:
            'The label for the navbar versions dropdown on mobile view',
        })
      : dropdownVersion.label;
  const dropdownTo =
    mobile && items ? undefined : getVersionMainDoc(dropdownVersion).path;

  // We don't want to render a version dropdown with 0 or 1 item
  // If we build the site with a single docs version (onlyIncludeVersions: ['1.0.0'])
  // We'd rather render a button instead of a dropdown
  if (items.length <= 1) {
    return (
      <DefaultNavbarItem
        {...props}
        mobile={mobile}
        label={dropdownLabel}
        to={dropdownTo}
        isActive={dropdownActiveClassDisabled ? () => false : undefined}
      />
    );
  }

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={dropdownLabel}
      to={dropdownTo}
      items={items}
      isActive={dropdownActiveClassDisabled ? () => false : undefined}
    />
  );
}
