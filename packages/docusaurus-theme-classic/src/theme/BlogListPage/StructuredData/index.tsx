/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {
  useBlogListPageStructuredData,
  StructuredData,
} from '@docusaurus/theme-common';
import type {Props} from '@theme/BlogListPage/StructuredData';

export default function BlogListPageStructuredData(props: Props): JSX.Element {
  const structuredData = useBlogListPageStructuredData(props);
  return <StructuredData structuredData={structuredData} />;
}
