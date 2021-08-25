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
export default function BlogPostAuthors({
  authors,
  frontMatterAssets,
}: Props): JSX.Element {
  return (
    <div className="row margin-top--md margin-bottom--sm">
      {authors.map((author, idx) => (
        <div className="col col--4" key={idx}>
          <BlogPostAuthor
            author={{
              ...author,
              // Author image is only converted to asset if declared at top level, i.e. single author
              // TODO: process multiple authors as well
              imageURL:
                frontMatterAssets.author_image_url ||
                frontMatterAssets.authorImageURL ||
                author.imageURL,
            }}
          />
        </div>
      ))}
    </div>
  );
}
