/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useEffect, useCallback} from 'react';
import clsx from 'clsx';
import {useHistory, useLocation} from '@docusaurus/router';

import {prepareUserState} from '../../index';

import styles from './styles.module.css';

export type Operator = 'OR' | 'AND';

const DefaultOperator: Operator = 'OR';

export const OperatorQueryKey = 'operator';

export function readOperator(search: string): Operator {
  const qsOperator =
    new URLSearchParams(search).get(OperatorQueryKey) ?? DefaultOperator;
  return qsOperator === 'AND' ? 'AND' : 'OR';
}

function setSearchOperator(search: string, operator: Operator): string {
  const searchParams = new URLSearchParams(search);
  searchParams.delete(OperatorQueryKey);
  if (!operator) {
    searchParams.append(OperatorQueryKey, 'AND');
  }
  return searchParams.toString();
}

function useOperator() {
  const location = useLocation();
  const history = useHistory();

  const [operator, setOperator] = useState(DefaultOperator);
  useEffect(() => {
    setOperator(readOperator(location.search));
  }, [location]);

  const toggleOperator = useCallback(() => {
    const newOperator = operator === 'AND' ? 'OR' : 'AND';
    setOperator(newOperator);
    const newSearch = setSearchOperator(location.search, newOperator);
    history.push({
      ...location,
      search: newSearch,
      state: prepareUserState(),
    });
  }, [operator, location, history]);

  return {operator, toggleOperator};
}

export default function OperatorButton() {
  const id = 'showcase_filter_toggle';
  const {operator, toggleOperator} = useOperator();
  return (
    <>
      <input
        type="checkbox"
        id={id}
        className="screen-reader-only"
        aria-label="Toggle between or and and for the tags you selected"
        onChange={toggleOperator}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            toggleOperator();
          }
        }}
        checked={operator !== DefaultOperator}
      />
      <label htmlFor={id} className={clsx(styles.checkboxLabel, 'shadow--md')}>
        {/* eslint-disable @docusaurus/no-untranslated-text */}
        <span className={styles.checkboxLabelOr}>OR</span>
        <span className={styles.checkboxLabelAnd}>AND</span>
        {/* eslint-enable @docusaurus/no-untranslated-text */}
      </label>
    </>
  );
}
