/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import {useLatestVersion, useActiveDocContext} from '@theme/hooks/useDocs';
import clsx from 'clsx';
import {getInfimaActiveClassName} from './index';
import type {Props} from '@theme/NavbarItem/DocSidebarNavbarItem';
import {useDocsPreferredVersion, uniq} from '@docusaurus/theme-common';
import type {GlobalDataVersion} from '@docusaurus/plugin-content-docs';

function getSidebarInVersion(versions: GlobalDataVersion[], sidebarId: string) {
  const allSidebars = versions.flatMap((version) => version.sidebars);
  if (!allSidebars) {
    throw new Error(`DocSidebarNavbarItem: couldn't find any sidebar`);
  }
  const sidebar = allSidebars[sidebarId];
  if (!sidebar) {
    throw new Error(
      `DocSidebarNavbarItem: couldn't find any sidebar with id "${sidebarId}" in version${
        versions.length ? 's' : ''
      } ${versions.map((version) => version.name).join(', ')}".
Available sidebar ids are:
- ${Object.keys(allSidebars).join('\n- ')}`,
    );
  }
  return sidebar.link;
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
    ) as GlobalDataVersion[],
  );
  const sidebarLink = getSidebarInVersion(versions, sidebarId);
  const activeDocInfimaClassName = getInfimaActiveClassName(props.mobile);

  return (
    <DefaultNavbarItem
      exact
      {...props}
      className={clsx(props.className, {
        [activeDocInfimaClassName]:
          activeDoc?.sidebar && activeDoc.sidebar === sidebarId,
      })}
      activeClassName={activeDocInfimaClassName}
      label={label ?? sidebarId}
      to={sidebarLink}
    />
  );
}
