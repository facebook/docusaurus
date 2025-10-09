/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useId} from 'react';
import clsx from 'clsx';
import {useOperator} from '../../_utils';

import styles from './styles.module.css';

export default function OperatorButton(): JSX.Element {
  const id = useId();
  const [operator, toggleOperator] = useOperator();
  return (
    <>
      <input
        id={id}
        type="checkbox"
        className="screen-reader-only"
        aria-label="Toggle between OR and AND for the tags you selected"
        checked={operator === 'AND'}
        onChange={toggleOperator}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            toggleOperator();
          }
        }}
      />
      <label htmlFor={id} className={clsx(styles.checkboxLabel, 'shadow--md')}>
        {/* eslint-disable-next-line @docusaurus/no-untranslated-text */}
        <span className={styles.checkboxLabelOr}>OR</span>
        {/* eslint-disable-next-line @docusaurus/no-untranslated-text */}
        <span className={styles.checkboxLabelAnd}>AND</span>
      </label>
    </>
  );
}
