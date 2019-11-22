/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Toggle from 'react-toggle';

import classnames from 'classnames';
import styles from './styles.module.css';

const Moon = () => <span className={classnames(styles.toggle, styles.moon)} />;
const Sun = () => <span className={classnames(styles.toggle, styles.sun)} />;

export default function(props) {
  return (
    <Toggle
      icons={{
        checked: <Moon />,
        unchecked: <Sun />,
      }}
      {...props}
    />
  );
}
