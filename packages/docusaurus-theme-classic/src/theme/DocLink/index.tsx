/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useLayoutDoc} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/DocLink';

export default function DocLink({
  docId,
  label: staticLabel,
  docsPluginId,
  ...props
}: Props): JSX.Element | null {
  const doc = useLayoutDoc(docId, docsPluginId);

  // Draft items are not displayed in the navbar.
  if (doc === null) {
    return null;
  }

  return (
    <Link exact {...props} to={doc.path}>
      {staticLabel ?? doc.id}
    </Link>
  );
}
