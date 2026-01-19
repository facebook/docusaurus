/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface Props {
  label: ReactNode;
  buttons?: ReactNode;
}

export default function PlaygroundHeader({label, buttons}: Props): ReactNode {
  return (
    <div className={clsx(styles.playgroundHeader)}>
      <div className={styles.playgroundHeaderLabel}>{label}</div>
      {buttons && (
        <div className={styles.playgroundHeaderButtons}>{buttons}</div>
      )}
    </div>
  );
}
