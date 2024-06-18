/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/BlogAuthorPage/Author';

import styles from './styles.module.css';

export default function Author({
  permalink,
  name,
  count,
  imageURL,
}: Props): JSX.Element {
  return (
    <Link
      href={permalink}
      className={clsx(
        styles.author,
        count ? styles.authorWithCount : styles.authorRegular,
      )}>
      {imageURL && (
        <img
          className={clsx('avatar__photo', styles.authorImage)}
          src={imageURL}
          alt={name}
        />
      )}
      {name}
      {count && <span>{count}</span>}
    </Link>
  );
}
