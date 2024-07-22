/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Author from '@theme/BlogPostItem/Header/Author';
import type {Props} from '@theme/AuthorsList';
import styles from './styles.module.css';

export default function AuthorsList({authors}: Props): JSX.Element {
  return (
    <section className={clsx('margin-vert--lg', styles.section)}>
      {authors.map((author) => (
        <Author
          key={author.key}
          author={author}
          singleAuthor
          count={author.count}
        />
      ))}
    </section>
  );
}
