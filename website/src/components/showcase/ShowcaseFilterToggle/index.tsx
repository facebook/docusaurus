/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useEffect, useCallback, useRef} from 'react';
import clsx from 'clsx';
import {useHistory, useLocation} from '@docusaurus/router';

import styles from './styles.module.css';

export type Operator = 'OR' | 'AND';

export const OperatorQueryKey = 'operator';

export function readOperator(search: string): Operator {
  return (new URLSearchParams(search).get(OperatorQueryKey) ??
    'OR') as Operator;
}

export default function ShowcaseFilterToggle(): JSX.Element {
  const id = `showcase_filter_toggle`;
  const location = useLocation();
  const history = useHistory();
  const [operator, setOperator] = useState(false);
  const inputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    inputRef.current.checked = readOperator(location.search) === 'AND';
  }, [location]);
  const toggleOperator = useCallback(() => {
    setOperator((o) => !o);
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(OperatorQueryKey);
    searchParams.append(OperatorQueryKey, operator ? 'OR' : 'AND');
    history.push({...location, search: searchParams.toString()});
  }, [operator, location, history]);

  return (
    <label
      htmlFor={id}
      className={clsx(
        styles.checkboxLabel,
        operator && styles.checkboxLabelChecked,
      )}>
      <input
        type="checkbox"
        id={id}
        ref={inputRef}
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
