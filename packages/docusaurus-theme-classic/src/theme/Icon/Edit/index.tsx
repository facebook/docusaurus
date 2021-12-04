/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/Icon/Edit';
import IconEditBase from './icon.svg';

import styles from './styles.module.css';

export default function IconEdit({
  className,
  ...restProps
}: Props): JSX.Element {
  return (
    <IconEditBase className={clsx(styles.iconEdit, className)} {...restProps} />
  );
}
