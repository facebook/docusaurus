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

function getAuthorsPerLine(authorsCount: number): 1 | 2 {
  switch (authorsCount) {
    case 0:
    case 1:
      return 1;
    default:
      return 2;
  }
}

function getColClassName(authorsCount: number): string {
  switch (getAuthorsPerLine(authorsCount)) {
    case 1:
      return 'col--12';
    case 2:
      return 'col--6';
    default:
      throw Error('unexpected');
  }
}

// Component responsible for the authors layout
export default function BlogPostAuthors({authors, assets}: Props): JSX.Element {
  const authorsCount = authors.length;
  if (authorsCount === 0) {
    return <></>;
  }
  return (
    <div className="row margin-top--md margin-bottom--sm">
      {authors.map((author, idx) => (
        <div className={clsx('col', getColClassName(authorsCount))} key={idx}>
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
