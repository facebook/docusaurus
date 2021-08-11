/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ComponentProps, ReactNode} from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

interface Props extends ComponentProps<'input'> {
  label: ReactNode;
}

function ShowcaseCheckbox({title, className, label, ...props}: Props) {
  const id = `showcase_checkbox_id_${props.name};`;
  return (
    <div className={clsx(className, styles.checkboxContainer)} title={title}>
      <input type="checkbox" id={id} {...props} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export default ShowcaseCheckbox;
