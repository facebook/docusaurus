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
import type {GlobalDoc} from '@docusaurus/plugin-content-docs/client';

function useNavbarItemDoc(
  docId: string,
  docsPluginId?: string,
): GlobalDoc | null {
  try {
    return useLayoutDoc(docId, docsPluginId);
  } catch (e) {
    throw new Error(
      [
        "There's a problem in a navbar item, check themeConfig.navbar.items",
        "in your Docusaurus config to make sure you aren't attempting to",
        'reference a non-existent doc.',
      ].join(' '),
      {cause: e},
    );
  }
}

export default function DocNavbarItem({
  docId,
  label: staticLabel,
  docsPluginId,
  ...props
}: Props): JSX.Element | null {
  const {activeDoc} = useActiveDocContext(docsPluginId);
  const doc = useNavbarItemDoc(docId, docsPluginId);
  const pageActive = activeDoc?.path === doc?.path;

  // Draft and unlisted items are not displayed in the navbar.
  if (doc === null || (doc.unlisted && !pageActive)) {
    return null;
  }

  return (
    <DefaultNavbarItem
      exact
      {...props}
      isActive={() =>
        pageActive ||
        (!!activeDoc?.sidebar && activeDoc.sidebar === doc.sidebar)
      }
      label={staticLabel ?? doc.id}
      to={doc.path}
    />
  );
}
