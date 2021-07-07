/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {useCollapsible} from '@docusaurus/theme-common';
import styles from './styles.module.css';
import {TOCHeadings} from '@theme/TOC';
import type {TOCCollapsibleProps} from '@theme/TOCCollapsible';

export default function TOCCollapsible({toc, className}: TOCCollapsibleProps) {
  const {collapsed, getToggleProps, getCollapsibleProps} = useCollapsible({
    initialState: true,
  });

  return (
    <div
      className={clsx(
        'margin-vert--md',
        styles.tocCollapsible,
        {
          [styles.tocCollapsibleExpanded]: !collapsed,
        },
        className,
      )}>
      <button
        type="button"
        className={styles.tocCollapsibleButton}
        {...getToggleProps()}>
        <Translate
          id="theme.TOCCollapsible.toggleButtonLabel"
          description="The label used by the button on the collapsible TOC component">
          On this page
        </Translate>
      </button>

      <div
        className={clsx(styles.tocCollapsibleContent)}
        {...getCollapsibleProps()}>
        <TOCHeadings toc={toc} />
      </div>
    </div>
  );
}
