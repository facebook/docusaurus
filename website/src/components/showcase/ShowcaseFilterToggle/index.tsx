/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ComponentProps} from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

interface Props extends ComponentProps<'input'> {
  label: string;
}

export default function ShowcaseFilterToggle({
  label,
  ...props
}: Props): JSX.Element {
  const id = `showcase_checkbox_id_${props.name}`;

  return (
    <label
      htmlFor={id}
      className={clsx(
        styles.checkboxLabel,
        props.checked && styles.checkboxLabelChecked,
      )}>
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        aria-label="Toggle between or and and for the tags you selected"
        {...props}
      />
      <div className={clsx('shadow--md', styles.checkboxLabelWrapper)}>
        <span className={styles.checkboxLabelOr}>OR</span>
        <span className={styles.checkboxLabelAnd}>AND</span>
      </div>
      <span className={styles.checkboxBox} />
    </label>
  );
}
