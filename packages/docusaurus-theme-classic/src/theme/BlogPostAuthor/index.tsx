/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/BlogPostAuthor';

import styles from './styles.module.css';
import clsx from 'clsx';

function BlogPostAuthor({author}: Props): JSX.Element {
  const {name, title, url, imageURL} = author;
  return (
    <div className="avatar margin-bottom--sm">
      {imageURL && (
        <Link className="avatar__photo-link avatar__photo" href={url}>
          <img className={styles.image} src={imageURL} alt={name} />
        </Link>
      )}

      {
        // Note: only legacy author frontmatter allow empty name (not frontMatter.authors)
        name && (
          <div
            className="avatar__intro"
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person">
            <div className="avatar__name">
              <Link href={url} itemProp="url">
                <span itemProp="name" className={styles.name}>
                  {name}
                </span>
              </Link>
            </div>
            {title && (
              <small
                className={clsx('avatar__subtitle', styles.title)}
                itemProp="description">
                {title}
              </small>
            )}
          </div>
        )
      }
    </div>
  );
}

export default BlogPostAuthor;
