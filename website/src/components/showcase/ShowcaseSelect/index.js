/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import styles from './styles.module.css';

function ShowcaseSelect({tag, label, onChange, value, children}) {
  const id = `showcase_select_id_${tag};`;
  return (
    <div className={styles.selectContainer}>
      <label htmlFor={id}>{label}</label>
      <select id={id} name={tag} onChange={onChange} value={value}>
        {children}
      </select>
    </div>
  );
}

export default ShowcaseSelect;
