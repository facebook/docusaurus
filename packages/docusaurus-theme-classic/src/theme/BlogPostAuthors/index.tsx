/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/BlogPostAuthors';
import BlogPostAuthor from '@theme/BlogPostAuthor';

// Component responsible for the authors layout
export default function BlogPostAuthors({authors, assets}: Props): JSX.Element {
  return (
    <div className="row margin-top--md margin-bottom--sm">
      {authors.map((author, idx) => (
        <div className="col col--4" key={idx}>
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
