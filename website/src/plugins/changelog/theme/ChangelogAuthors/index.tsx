/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import clsx from 'clsx';
import ChangelogAuthor from '@theme/ChangelogAuthor';
import IconExpand from '@theme/IconExpand';
import type {Props} from '@theme/BlogPostAuthors';

import styles from './styles.module.css';

// Component responsible for the authors layout
export default function BlogPostAuthors({
  authors,
  assets,
}: Props): JSX.Element | null {
  const [expanded, setExpanded] = useState(false);
  const authorsCount = authors.length;
  if (authorsCount === 0) {
    return null;
  }
  const filteredAuthors = authors.slice(0, expanded ? authors.length : 10);
  return (
    <div
      className={clsx(
        'margin-top--md margin-bottom--sm',
        styles.imageOnlyAuthorRow,
      )}>
      {filteredAuthors.map((author, idx) => (
        <div className={styles.imageOnlyAuthorCol} key={idx}>
          <ChangelogAuthor
            author={{
              ...author,
              // Handle author images using relative paths
              imageURL: assets.authorsImageUrls[idx] ?? author.imageURL,
            }}
          />
        </div>
      ))}
      {authors.length > 10 && (
        <button
          className={clsx('clean-btn', styles.toggleButton)}
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label="expand">
          <IconExpand expanded={expanded} />
        </button>
      )}
    </div>
  );
}
