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
  docsPluginId,
  children,
  ...props
}: Props): JSX.Element | null {
  const doc = useLayoutDoc(docId, docsPluginId);

  // Will error out if the doc doesn't exist
  if (doc === null) {
    return null;
  }

  return (
    <Link exact {...props} to={doc.path}>
      {children ?? doc.title}
    </Link>
  );
}
