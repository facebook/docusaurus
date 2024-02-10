/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {
  useBlogPostStructuredData,
  StructuredData,
} from '@docusaurus/theme-common';
import type {Props} from '@theme/BlogPostPage/StructuredData';

export default function BlogPostStructuredData(props: Props): JSX.Element {
  const structuredData = useBlogPostStructuredData(props);
  return <StructuredData structuredData={structuredData} />;
}
