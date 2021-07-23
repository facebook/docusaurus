/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useRef, useState} from 'react';
import clsx from 'clsx';
import {useCollapsible, Collapsible} from '@docusaurus/theme-common';
import type {Props} from '@theme/Details';
import styles from './styles.module.css';

const BaseClassName = 'alert alert--info';

const Details = ({
  baseClassName = BaseClassName,
  summary,
  children,
  ...props
}: Props): JSX.Element => {
  const ref = useRef<HTMLDetailsElement>(null);

  const {collapsed, setCollapsed} = useCollapsible({
    initialState: !props.open,
  });
  // We use a separate prop because it must be set only after animation completes
  // Otherwise close anim won't work
  const [open, setOpen] = useState(props.open);

  return (
    <details
      {...props}
      ref={ref}
      open={open}
      onMouseDown={(e) => {
        if (e.detail > 1) {
          e.preventDefault();
        }
      }}
      onClick={(e) => {
        const isSummaryChildClick =
          (e.target as HTMLElement).tagName === 'SUMMARY' &&
          (e.target as HTMLElement).parentElement === ref.current;
        if (!isSummaryChildClick) {
          return;
        }
        e.preventDefault();
        // const isOpening = (e.target as HTMLDetailsElement).open;
        const isOpening = collapsed;
        if (isOpening) {
          setCollapsed(false);
          setOpen(true);
        } else {
          setCollapsed(true);
          // setOpen(false); // Don't do this, it breaks close animation!
        }
      }}
      className={clsx(baseClassName, styles.details, props.className)}>
      {summary}

      <Collapsible
        lazy={false} // Content might matter for SEO in this case
        collapsed={collapsed}
        onCollapseTransitionEnd={(newCollapsed) => {
          setCollapsed(newCollapsed);
          setOpen(!newCollapsed);
        }}>
        <div className={styles.collapsibleContent}>{children}</div>
      </Collapsible>
    </details>
  );
};

export default Details;
