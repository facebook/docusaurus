/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/Navbar/Search';

import styles from './styles.module.css';

export default function NavbarSearch({
  children,
  className,
}: Props): JSX.Element {
  return <div className={clsx(className, styles.searchBox)}>{children}</div>;
}
