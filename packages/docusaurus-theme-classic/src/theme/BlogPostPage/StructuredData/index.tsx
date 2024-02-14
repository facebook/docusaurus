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

export default function BlogPostStructuredData(): JSX.Element {
  const structuredData = useBlogPostStructuredData();
  return <StructuredData structuredData={structuredData} />;
}
