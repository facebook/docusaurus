/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/BlogPostAuthors';
import BlogPostAuthor from '@theme/BlogPostAuthor';

import styles from './styles.module.css';

// Component responsible for the authors layout
export default function BlogPostAuthors({
  authors,
  assets,
}: Props): JSX.Element | null {
  const authorsCount = authors.length;
  if (authorsCount === 0) {
    return null;
  }
  return (
    <div className="row margin-top--md margin-bottom--sm">
      {authors.map((author, idx) => (
        <div className={clsx('col col--6', styles.authorCol)} key={idx}>
          <BlogPostAuthor
            author={{
              ...author,
              // Handle author images using relative paths
              imageURL: assets.authorsImageUrls[idx] ?? author.imageURL,
            }}
          />
        </div>
      ))}
    </div>
  );
}
