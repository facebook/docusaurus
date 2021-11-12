/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import type {Props} from '@theme/DocCategoryGeneratedIndexPage';
import DocCardList from '@theme/DocCardList';
import {useCategoryGeneratedIndexSidebarItem} from '@docusaurus/theme-common';

import styles from './styles.module.css';

export default function DocCategoryGeneratedIndexPage(
  props: Props,
): JSX.Element {
  const {categoryIndex} = props;
  const category = useCategoryGeneratedIndexSidebarItem(categoryIndex);
  return (
    <div className={styles.page}>
      <header>
        <h1>{category.label}</h1>
      </header>
      <main className="margin-top--lg">
        <DocCardList items={category.items} />
      </main>
    </div>
  );
}
