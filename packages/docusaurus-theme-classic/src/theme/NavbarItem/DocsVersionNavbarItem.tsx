/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DefaultNavbarItem from './DefaultNavbarItem';
import {useActiveVersion, useLatestVersion} from '@theme/hooks/useDocs';

export default function DocsVersionNavbarItem({instancePath, ...props}) {
  const activeVersion = useActiveVersion(instancePath);
  const latestVersion = useLatestVersion(instancePath);
  const label = activeVersion?.name ?? latestVersion.name;
  return <DefaultNavbarItem {...props} label={label} />;
}
