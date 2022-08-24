/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {Props} from '@theme/Navbar/Search';

import styles from './styles.module.css';

export default function NavbarSearch({
  children,
  className,
}: Props): JSX.Element | null {
  const {siteConfig} = useDocusaurusContext();
  if (!siteConfig.themeConfig?.algolia) {
    return null;
  }
  return <div className={clsx(className, styles.searchBox)}>{children}</div>;
}
