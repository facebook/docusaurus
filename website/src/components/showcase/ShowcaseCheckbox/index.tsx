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

function ShowcaseCheckbox({
  title,
  className,
  label,
  ...props
}: Props): JSX.Element {
  const id = `showcase_checkbox_id_${props.name};`;

  return (
    <li
      title={title}
      key={title}
      className={clsx(className, styles.checkboxListItem)}>
      <input type="checkbox" id={id} className="sr-only" {...props} />
      <label tabIndex={0} htmlFor={id} className={styles.checkboxLabel}>
        {label}
      </label>
    </li>
  );
}

export default ShowcaseCheckbox;
