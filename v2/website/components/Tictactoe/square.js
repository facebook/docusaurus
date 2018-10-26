/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import styles from './styles.css';

export default props => {
  return (
    <button className={styles.square} onClick={props.onClick}>
      {props.value}
    </button>
  );
};
