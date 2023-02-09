/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import {useLayoutDocsSidebar} from '@docusaurus/theme-common/internal';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import type {Props} from '@theme/NavbarItem/DocSidebarNavbarItem';

export default function DocSidebarNavbarItem({
  sidebarId,
  label,
  docsPluginId,
  ...props
}: Props): JSX.Element {
  const {activeDoc} = useActiveDocContext(docsPluginId);
  const sidebarLink = useLayoutDocsSidebar(sidebarId, docsPluginId).link;
  if (!sidebarLink) {
    throw new Error(
      `DocSidebarNavbarItem: Sidebar with ID "${sidebarId}" doesn't have anything to be linked to.`,
    );
  }
  return (
    <DefaultNavbarItem
      exact
      {...props}
      isActive={() => activeDoc?.sidebar === sidebarId}
      label={label ?? sidebarLink.label}
      to={sidebarLink.path}
    />
  );
}
