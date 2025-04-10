/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

export default function PlaygroundHeader({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return <div className={clsx(styles.playgroundHeader)}>{children}</div>;
}
