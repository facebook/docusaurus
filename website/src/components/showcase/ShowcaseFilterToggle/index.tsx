/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useCallback} from 'react';
import clsx from 'clsx';
import {useHistory, useLocation} from '@docusaurus/router';

import styles from './styles.module.css';

export type Operator = 'OR' | 'AND';

export const OperatorQueryKey = 'operator';

export default function ShowcaseFilterToggle(): JSX.Element {
  const id = `showcase_filter_toggle`;
  const location = useLocation();
  const history = useHistory();
  const [operator, setOperator] = useState<Operator>('OR');
  const toggleOperator = useCallback(() => {
    setOperator(operator === 'AND' ? 'OR' : 'AND');
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(OperatorQueryKey);
    searchParams.append(OperatorQueryKey, operator === 'AND' ? 'OR' : 'AND');
    history.push({...location, search: searchParams.toString()});
  }, [operator, location, history]);

  return (
    <label
      htmlFor={id}
      className={clsx(
        styles.checkboxLabel,
        operator === 'AND' && styles.checkboxLabelChecked,
      )}>
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        aria-label="Toggle between or and and for the tags you selected"
        onChange={toggleOperator}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            toggleOperator();
          }
        }}
      />
      <div className={clsx('shadow--md', styles.checkboxLabelWrapper)}>
        <span className={styles.checkboxLabelOr}>OR</span>
        <span className={styles.checkboxLabelAnd}>AND</span>
      </div>
      <span className={styles.checkboxBox} />
    </label>
  );
}
