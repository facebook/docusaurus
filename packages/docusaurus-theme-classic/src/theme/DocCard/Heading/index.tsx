/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import type {Props} from '@theme/DocCard/Heading';

import styles from './styles.module.css';

export default function DocCardHeading({title, icon}: Props): ReactNode {
  return (
    <Heading
      as="h2"
      className={clsx('text--truncate', styles.heading)}
      title={title}>
      {icon && <span className={styles.headingIcon}>{icon}</span>}
      <span className={styles.headingText}>{title}</span>
    </Heading>
  );
}
