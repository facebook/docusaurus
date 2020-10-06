/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DefaultNavbarItem from './DefaultNavbarItem';
import {useLatestVersion, useActiveDocContext} from '@theme/hooks/useDocs';
import clsx from 'clsx';
import type {Props} from '@theme/NavbarItem/DocNavbarItem';

export default function DocNavbarItem({
  docId,
  activeSidebarClassName,
  label: staticLabel,
  docsPluginId,
  ...props
}: Props): JSX.Element {
  const latestVersion = useLatestVersion(docsPluginId);
  const {activeVersion, activeDoc} = useActiveDocContext(docsPluginId);

  const version = activeVersion ?? latestVersion;

  const doc = version.docs.find((versionDoc) => versionDoc.id === docId);
  if (!doc) {
    throw new Error(
      `DocNavbarItem: couldn't find any doc with id=${docId} in version ${
        version.name
      }.
Available docIds=\n- ${version.docs.join('\n- ')}`,
    );
  }

  return (
    <DefaultNavbarItem
      exact
      {...props}
      className={clsx(props.className, {
        [activeSidebarClassName]:
          activeDoc && activeDoc.sidebar === doc.sidebar,
      })}
      label={staticLabel ?? doc.id}
      to={doc.path}
    />
  );
}
