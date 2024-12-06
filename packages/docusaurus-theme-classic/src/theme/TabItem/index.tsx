/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/TabItem';

import styles from './styles.module.css';

export default function TabItem({
  children,
  hidden,
  className,
}: Props): ReactNode {
  return (
    <div
      role="tabpanel"
      className={clsx(styles.tabItem, className)}
      {...{hidden}}>
      {children}
    </div>
  );
}
