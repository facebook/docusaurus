/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/Tag';

import styles from './styles.module.css';

export default function Tag({
  permalink,
  label,
  count,
  description,
}: Props): JSX.Element {
  return (
    <Link
      href={permalink}
      title={description}
      className={clsx(
        styles.tag,
        count ? styles.tagWithCount : styles.tagRegular,
      )}>
      {label}
      {count && <span>{count}</span>}
    </Link>
  );
}
