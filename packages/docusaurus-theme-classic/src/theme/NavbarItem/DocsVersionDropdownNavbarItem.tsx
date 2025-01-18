/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import {
  useVersions,
  useActiveDocContext,
  useDocsVersionCandidates,
  useDocsPreferredVersion,
} from '@docusaurus/plugin-content-docs/client';
import {translate} from '@docusaurus/Translate';
import {useLocation} from '@docusaurus/router';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import type {
  Props,
  PropVersions,
  PropVersionItem,
} from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';
import type {
  GlobalVersion,
  GlobalDoc,
  ActiveDocContext,
} from '@docusaurus/plugin-content-docs/client';

type VersionConfiguration = {name: string} & PropVersionItem;

function getVersionConfigurations(
  versions: PropVersions,
): VersionConfiguration[] {
  if (versions instanceof Array) {
    return versions.map((name): VersionConfiguration => {
      return {name};
    });
  } else {
    return Object.entries(versions).map(
      ([name, version]): VersionConfiguration => {
        return {name, ...version};
      },
    );
  }
}

function getVersionConfigurationName(version: GlobalVersion): string {
  // 'version.name' has special conventions for current and next versions,
  // that's why we use 'version.label' as a canonical version name that can be
  // referenced in configuration.
  return version.label;
}

function getVersionMainDoc(version: GlobalVersion): GlobalDoc {
  return version.docs.find((doc) => doc.id === version.mainDocId)!;
}

function getVersionTargetDoc(
  version: GlobalVersion,
  activeDocContext: ActiveDocContext,
): GlobalDoc {
  // We try to link to the same doc, in another version
  // When not possible, fallback to the "main doc" of the version
  return (
    activeDocContext.alternateDocVersions[version.name] ??
    getVersionMainDoc(version)
  );
}

export default function DocsVersionDropdownNavbarItem({
  mobile,
  docsPluginId,
  dropdownActiveClassDisabled,
  dropdownItemsBefore,
  dropdownItemsAfter,
  versions: staticVersions,
  ...props
}: Props): ReactNode {
  // Prepare version configurations
  const versionConfigurations = staticVersions
    ? new Map<string, VersionConfiguration>(
        getVersionConfigurations(staticVersions).map((configuration) => [
          configuration.name,
          configuration,
        ]),
      )
    : undefined;

  // Build version list
  let versions = useVersions(docsPluginId);
  if (versionConfigurations) {
    // Keep configured versions only
    versions = versions.filter((version) =>
      versionConfigurations.has(getVersionConfigurationName(version)),
    );
  }

  // Build item list
  const {search, hash} = useLocation();
  const activeDocContext = useActiveDocContext(docsPluginId);
  const {savePreferredVersionName} = useDocsPreferredVersion(docsPluginId);

  function versionToLink(
    version: GlobalVersion,
    versionConfiguration?: VersionConfiguration,
  ): LinkLikeNavbarItemProps {
    const targetDoc = getVersionTargetDoc(version, activeDocContext);
    return {
      label: versionConfiguration?.label ?? version.label,
      // preserve ?search#hash suffix on version switches
      to: `${targetDoc.path}${search}${hash}`,
      isActive: () => version === activeDocContext.activeVersion,
      onClick: () => savePreferredVersionName(version.name),
    };
  }

  const items: LinkLikeNavbarItemProps[] = [
    ...dropdownItemsBefore,
    ...versions.map((x) =>
      versionToLink(
        x,
        versionConfigurations?.get(getVersionConfigurationName(x)),
      ),
    ),
    ...dropdownItemsAfter,
  ];

  const dropdownVersion = useDocsVersionCandidates(docsPluginId)[0];

  // Mobile dropdown is handled a bit differently
  const dropdownLabel =
    mobile && items.length > 1
      ? translate({
          id: 'theme.navbar.mobileVersionsDropdown.label',
          message: 'Versions',
          description:
            'The label for the navbar versions dropdown on mobile view',
        })
      : dropdownVersion.label;
  const dropdownTo =
    mobile && items.length > 1
      ? undefined
      : getVersionTargetDoc(dropdownVersion, activeDocContext).path;

  // We don't want to render a version dropdown with 0 or 1 item. If we build
  // the site with a single docs version (onlyIncludeVersions: ['1.0.0']),
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
