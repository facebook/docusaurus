/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {useDocsFilter} from '@docusaurus/theme-common';
import type {Props} from '@theme/DocSidebar/Desktop/Filter';

import styles from './styles.module.css';

function Filter({className}: Props): JSX.Element {
  const {setFilterTerm, filterTerm = ''} = useDocsFilter();

  return (
    <div className={clsx(styles.filter, className)}>
      <input
        placeholder="Filter by title" // todo: i18n
        type="text"
        className={styles.filterInput}
        onChange={(e) => setFilterTerm(e.target.value)}
        value={filterTerm}
      />

      {filterTerm && (
        <button
          type="button"
          className={clsx('clean-btn', styles.clearFilterInputBtn)}
          onClick={() => setFilterTerm('')}>
          <svg
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default Filter;
