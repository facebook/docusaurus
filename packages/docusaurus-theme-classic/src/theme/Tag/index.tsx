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

function Tag(props: Props): JSX.Element {
  const {permalink, name, count} = props;

  return (
    <Link
      href={permalink}
      className={clsx(styles.tag, {
        [styles.tagRegular]: !count,
        [styles.tagWithCount]: count,
      })}>
      {name}
      {count && <span>{count}</span>}
    </Link>
  );
}

export default Tag;
