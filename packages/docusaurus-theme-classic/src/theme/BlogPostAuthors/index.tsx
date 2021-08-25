/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/BlogPostAuthors';
import BlogPostAuthor from '@theme/BlogPostAuthor';

function getAuthorsPerLine(authorsCount: number): 1 | 2 | 3 {
  switch (authorsCount) {
    case 0:
    case 1:
      return 1;
    case 2:
    case 4:
      return 2;
    default:
      return 3;
  }
}

function getColClassName(authorsCount: number): string {
  switch (getAuthorsPerLine(authorsCount)) {
    case 1:
      return 'col--12';
    case 2:
      return 'col--6';
    case 3:
      return 'col--4';
    default:
      throw Error('unexpected');
  }
}

// Component responsible for the authors layout
export default function BlogPostAuthors({authors, assets}: Props): JSX.Element {
  const colClassName = getColClassName(authors.length);
  return (
    <div className="row margin-top--md margin-bottom--sm">
      {authors.map((author, idx) => (
        <div className={`col ${colClassName}`} key={idx}>
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
