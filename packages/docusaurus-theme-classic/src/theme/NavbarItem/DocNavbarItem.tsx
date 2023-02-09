/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import {useLayoutDoc} from '@docusaurus/theme-common/internal';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import type {Props} from '@theme/NavbarItem/DocNavbarItem';

export default function DocNavbarItem({
  docId,
  label: staticLabel,
  docsPluginId,
  ...props
}: Props): JSX.Element | null {
  const {activeDoc} = useActiveDocContext(docsPluginId);
  const doc = useLayoutDoc(docId, docsPluginId);

  // Draft items are not displayed in the navbar.
  if (doc === null) {
    return null;
  }

  return (
    <DefaultNavbarItem
      exact
      {...props}
      isActive={() =>
        activeDoc?.path === doc.path ||
        (!!activeDoc?.sidebar && activeDoc.sidebar === doc.sidebar)
      }
      label={staticLabel ?? doc.id}
      to={doc.path}
    />
  );
}
