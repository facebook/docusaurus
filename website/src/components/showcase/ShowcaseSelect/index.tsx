/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ComponentProps} from 'react';

import styles from './styles.module.css';

interface Props extends ComponentProps<'select'> {
  label: string;
}

function ShowcaseSelect({label, ...props}: Props) {
  const id = `showcase_select_id_${props.name};`;
  return (
    <div className={styles.selectContainer}>
      <label htmlFor={id}>{label}</label>
      <select id={id} {...props}>
        {props.children}
      </select>
    </div>
  );
}

export default ShowcaseSelect;
