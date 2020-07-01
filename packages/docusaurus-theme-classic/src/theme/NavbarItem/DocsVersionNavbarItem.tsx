/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DefaultNavbarItem from './DefaultNavbarItem';
import {useDocsActiveVersionMetadata} from '@theme/hooks/useDocs';

export default function DocsVersionNavbarItem({
  instancePath,
  fallbackLabel,
  ...props
}) {
  const activeVersionMetadata = useDocsActiveVersionMetadata(instancePath);
  const label = activeVersionMetadata?.version ?? fallbackLabel;
  return <DefaultNavbarItem {...props} label={label} />;
}
