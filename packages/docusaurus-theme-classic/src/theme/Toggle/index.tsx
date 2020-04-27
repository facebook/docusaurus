/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Toggle from 'react-toggle';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import clsx from 'clsx';
import styles from './styles.module.css';

const Moon = () => <span className={clsx(styles.toggle, styles.moon)} />;
const Sun = () => <span className={clsx(styles.toggle, styles.sun)} />;

export default function (props) {
  const {isClient} = useDocusaurusContext();
  return (
    <Toggle
      disabled={!isClient}
      icons={{
        checked: <Moon />,
        unchecked: <Sun />,
      }}
      {...props}
    />
  );
}
