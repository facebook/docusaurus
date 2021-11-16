/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ComponentProps, ReactNode, ReactElement} from 'react';

import styles from './styles.module.css';

interface Props extends ComponentProps<'input'> {
  icon: ReactElement<ComponentProps<'svg'>>;
  label: ReactNode;
}

const ShowcaseCheckbox = React.forwardRef<HTMLLabelElement, Props>(
  ({className, id, icon, label, ...rest}, ref) => (
    <>
      <input type="checkbox" id={id} className="sr-only" {...rest} />
      <label
        ref={ref}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        htmlFor={id}
        className={styles.checkboxLabel}
        aria-describedby={id}>
        {label}
        {icon}
      </label>
    </>
  ),
);

export default ShowcaseCheckbox;
