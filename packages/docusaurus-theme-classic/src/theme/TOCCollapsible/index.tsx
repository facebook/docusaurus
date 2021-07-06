/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useRef} from 'react';
import clsx from 'clsx';
import useCollapse from '@theme/hooks/useCollapse';
import styles from './styles.module.css';
import {Headings} from '@theme/TOC';
import type {TOCCollapsibleProps} from '@theme/TOCCollapsible';

export default function TOCCollapsible({toc, className}: TOCCollapsibleProps) {
  const tocRef = useRef(null);
  const [collapsed, setCollapsed] = useCollapse(true, tocRef);
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
        onClick={() => setCollapsed(!collapsed)}>
        Contents of this page
      </button>

      <div ref={tocRef} className={clsx(styles.tocCollapsibleContent)}>
        <Headings toc={toc} />
      </div>
    </div>
  );
}
