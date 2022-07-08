/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title';
import BlogPostItemHeaderDate from '@theme/BlogPostItem/Header/Date';
import BlogPostItemHeaderAuthors from '@theme/BlogPostItem/Header/Authors';

export default function BlogPostItemHeader(): JSX.Element {
  return (
    <header>
      <BlogPostItemHeaderTitle />
      <BlogPostItemHeaderDate />
      <BlogPostItemHeaderAuthors />
    </header>
  );
}
