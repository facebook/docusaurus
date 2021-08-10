/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ComponentProps, ReactNode} from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

interface Props
  extends ComponentProps<'div'>,
    Pick<ComponentProps<'input'>, 'name' | 'checked'> {
  label: ReactNode;
}

function ShowcaseCheckbox({
  className,
  name,
  label,
  onChange,
  checked,
  ...props
}: Props) {
  const id = `showcase_checkbox_id_${name};`;
  return (
    <div className={clsx(className, styles.checkboxContainer)} {...props}>
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
