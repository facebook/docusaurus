/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useBlogPost} from '@docusaurus/theme-common/internal';
import BlogPostAuthors from '@theme/BlogPostAuthors';
import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title';
import BlogPostItemHeaderDate from '@theme/BlogPostItem/Header/Date';

export default function BlogPostItemHeader(): JSX.Element {
  const {metadata, assets} = useBlogPost();
  return (
    <header>
      <BlogPostItemHeaderTitle />
      <BlogPostItemHeaderDate />
      <BlogPostAuthors authors={metadata.authors} assets={assets} />
    </header>
  );
}
