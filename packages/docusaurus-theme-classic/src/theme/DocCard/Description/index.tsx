/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/DocCard/Description';

import styles from './styles.module.css';

export default function DocCardDescription({description}: Props): ReactNode {
  return (
    <p
      className={clsx('text--truncate', styles.description)}
      title={description}>
      {description}
    </p>
  );
}
