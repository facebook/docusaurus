/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import BlogPostAuthors from '@theme/BlogPostAuthors';

import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title';
import BlogPostItemHeaderMetadata from '@theme/BlogPostItem/Header/Metadata';

import type {Props} from '@theme/BlogPostItem/Header';

export default function BlogPostItemHeader(props: Props): JSX.Element {
  return (
    <header>
      <BlogPostItemHeaderTitle {...props} />
      <BlogPostItemHeaderMetadata {...props} />
      <BlogPostAuthors authors={props.metadata.authors} assets={props.assets} />
    </header>
  );
}
