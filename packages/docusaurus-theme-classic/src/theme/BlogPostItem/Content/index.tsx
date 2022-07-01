/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {blogPostContainerID} from '@docusaurus/utils-common';
import MDXContent from '@theme/MDXContent';
import type {Props} from '@theme/BlogPostItem/Content';

export default function BlogPostItemContent(props: Props): JSX.Element {
  const {children, isBlogPostPage = false} = props;
  return (
    <div
      // This ID is used for the feed generation to locate the main content
      id={isBlogPostPage ? blogPostContainerID : undefined}
      className="markdown"
      itemProp="articleBody">
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
