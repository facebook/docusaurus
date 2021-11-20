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
import type {Props} from '@theme/NavbarItem/DocNavbarItem';
import {useDocsPreferredVersion, uniq} from '@docusaurus/theme-common';
import type {GlobalDataVersion} from '@docusaurus/plugin-content-docs';

function getDocInVersions(versions: GlobalDataVersion[], docId: string) {
  const allDocs = versions.flatMap((version) => version.docs);
  const doc = allDocs.find((versionDoc) => versionDoc.id === docId);
  if (!doc) {
    const docIds = allDocs.map((versionDoc) => versionDoc.id).join('\n- ');
    throw new Error(
      `DocNavbarItem: couldn't find any doc with id "${docId}" in version${
        versions.length ? 's' : ''
      } ${versions.map((version) => version.name).join(', ')}".
Available doc ids are:\n- ${docIds}`,
    );
  }
  return doc;
}

export default function DocNavbarItem({
  docId,
  label: staticLabel,
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
  const doc = getDocInVersions(versions, docId);
  const activeDocInfimaClassName = getInfimaActiveClassName(props.mobile);

  return (
    <DefaultNavbarItem
      exact
      {...props}
      className={clsx(props.className, {
        [activeDocInfimaClassName]:
          activeDoc?.sidebar && activeDoc.sidebar === doc.sidebar,
      })}
      activeClassName={activeDocInfimaClassName}
      label={staticLabel ?? doc.id}
      to={doc.path}
    />
  );
}
