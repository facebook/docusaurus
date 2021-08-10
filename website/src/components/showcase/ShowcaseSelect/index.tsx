/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {HTMLAttributes} from 'react';

import styles from './styles.module.css';

interface Props extends HTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  value: string;
}

function ShowcaseSelect({name, label, onChange, value, children}: Props) {
  const id = `showcase_select_id_${name};`;
  return (
    <div className={styles.selectContainer}>
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} onChange={onChange} value={value}>
        {children}
      </select>
    </div>
  );
}

export default ShowcaseSelect;
