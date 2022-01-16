/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import {
  useLatestVersion,
  useActiveDocContext,
} from '@docusaurus/plugin-content-docs/client';
import clsx from 'clsx';
import {getInfimaActiveClassName} from '@theme/NavbarItem/utils';
import {useDocsPreferredVersion, uniq} from '@docusaurus/theme-common';

import type {Props} from '@theme/NavbarItem/DocSidebarNavbarItem';
import type {
  GlobalVersion,
  GlobalSidebar,
} from '@docusaurus/plugin-content-docs/client';

function getSidebarLink(versions: GlobalVersion[], sidebarId: string) {
  const allSidebars = versions
    .flatMap((version) => {
      if (version.sidebars) {
        return Object.entries(version.sidebars);
      }
      return undefined;
    })
    .filter(
      (sidebarItem): sidebarItem is [string, GlobalSidebar] => !!sidebarItem,
    );
  const sidebarEntry = allSidebars.find((sidebar) => sidebar[0] === sidebarId);
  if (!sidebarEntry) {
    throw new Error(
      `DocSidebarNavbarItem: couldn't find any sidebar with id "${sidebarId}" in version${
        versions.length ? 's' : ''
      } ${versions.map((version) => version.name).join(', ')}".
Available sidebar ids are:
- ${Object.keys(allSidebars).join('\n- ')}`,
    );
  }
  if (!sidebarEntry[1].link) {
    throw new Error(
      `DocSidebarNavbarItem: couldn't find any document for sidebar with id "${sidebarId}"`,
    );
  }
  return sidebarEntry[1].link;
}

export default function DocSidebarNavbarItem({
  sidebarId,
  label,
  docsPluginId,
  ...props
}: Props): JSX.Element {
  const {activeVersion, activeDoc} = useActiveDocContext(docsPluginId);
  const {preferredVersion} = useDocsPreferredVersion(docsPluginId);
  const latestVersion = useLatestVersion(docsPluginId);

  // Versions used to look for the doc to link to, ordered + no duplicate
  const versions = uniq(
    [activeVersion, preferredVersion, latestVersion].filter(
      Boolean,
    ) as GlobalVersion[],
  );
  const sidebarLink = getSidebarLink(versions, sidebarId);
  const activeDocInfimaClassName = getInfimaActiveClassName(props.mobile);

  return (
    <DefaultNavbarItem
      exact
      {...props}
      className={clsx(props.className, {
        [activeDocInfimaClassName]: activeDoc?.sidebar === sidebarId,
      })}
      activeClassName={activeDocInfimaClassName}
      label={label ?? sidebarLink.label}
      to={sidebarLink.path}
    />
  );
}
