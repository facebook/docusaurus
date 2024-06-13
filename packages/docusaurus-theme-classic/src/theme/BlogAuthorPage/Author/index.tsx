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

export default function Author({permalink, name, count}: Props): JSX.Element {
  return (
    <Link
      href={permalink}
      className={clsx(
        styles.author,
        count ? styles.authorWithCount : styles.authorRegular,
      )}>
      {name}
      {count && <span>{count}</span>}
    </Link>
  );
}
