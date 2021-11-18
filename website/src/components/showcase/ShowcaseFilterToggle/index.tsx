/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useEffect, useCallback} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';

import styles from './styles.module.css';

export type Operator = 'OR' | 'AND';

export const OperatorQueryKey = 'operator';

export function readOperator(search: string): Operator {
  return (new URLSearchParams(search).get(OperatorQueryKey) ??
    'OR') as Operator;
}

export default function ShowcaseFilterToggle(): JSX.Element {
  const id = 'showcase_filter_toggle';
  const location = useLocation();
  const history = useHistory();
  const [operator, setOperator] = useState(false);
  useEffect(() => {
    setOperator(readOperator(location.search) === 'AND');
  }, [location]);
  const toggleOperator = useCallback(() => {
    setOperator((o) => !o);
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(OperatorQueryKey);
    searchParams.append(OperatorQueryKey, operator ? 'OR' : 'AND');
    history.push({...location, search: searchParams.toString()});
  }, [operator, location, history]);

  return (
    <div className="shadow--md">
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
        checked={operator}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={id} className={styles.checkboxLabel}>
        <span className={styles.checkboxLabelOr}>OR</span>
        <span className={styles.checkboxLabelAnd}>AND</span>
        <span className={styles.checkboxToggle} aria-hidden />
      </label>
    </div>
  );
}
