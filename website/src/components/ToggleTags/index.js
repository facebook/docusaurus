/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import styles from './styles.module.css';

function ToggleTags(props) {
  return (
    <div className={styles.tag}>
      <input
        type="checkbox"
        id={props.tag}
        name={props.tag}
        onChange={props.change}
      />
      <label htmlFor={props.tag}>{props.tag}</label>
    </div>
  );
}

export default ToggleTags;
