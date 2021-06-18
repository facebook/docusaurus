/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

function ShowcaseCheckbox({
  className,
  name,
  label,
  onChange,
  checked,
  ...props
}) {
  const id = `showcase_checkbox_id_${name};`;
  return (
    <div className={clsx(props.className, styles.checkboxContainer)} {...props}>
      <input
        type="checkbox"
        id={id}
        name={name}
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export default ShowcaseCheckbox;
