/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {useCollapsible, Collapsible} from '@docusaurus/theme-common';
import styles from './styles.module.css';
import TOCItems from '@theme/TOCItems';
import type {TOCCollapsibleProps} from '@theme/TOCCollapsible';

export default function TOCCollapsible({
  toc,
  className,
  minHeadingLevel,
  maxHeadingLevel,
}: TOCCollapsibleProps): JSX.Element {
  const {collapsed, toggleCollapsed} = useCollapsible({
    initialState: true,
  });

  return (
    <div
      className={clsx(
        styles.tocCollapsible,
        {
          [styles.tocCollapsibleExpanded]: !collapsed,
        },
        className,
      )}>
      <button
        type="button"
        className={clsx('clean-btn', styles.tocCollapsibleButton)}
        onClick={toggleCollapsed}>
        <Translate
          id="theme.TOCCollapsible.toggleButtonLabel"
          description="The label used by the button on the collapsible TOC component">
          On this page
        </Translate>
      </button>

      <Collapsible
        lazy
        className={styles.tocCollapsibleContent}
        collapsed={collapsed}>
        <TOCItems
          toc={toc}
          minHeadingLevel={minHeadingLevel}
          maxHeadingLevel={maxHeadingLevel}
        />
      </Collapsible>
    </div>
  );
}
