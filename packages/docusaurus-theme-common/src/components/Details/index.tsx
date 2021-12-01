/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ComponentProps, ReactElement, useRef, useState} from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import clsx from 'clsx';
import {useCollapsible, Collapsible} from '../Collapsible';
import styles from './styles.module.css';

function isInSummary(node: HTMLElement | null): boolean {
  if (!node) {
    return false;
  }
  return node.tagName === 'SUMMARY' || isInSummary(node.parentElement);
}

function hasParent(node: HTMLElement | null, parent: HTMLElement): boolean {
  if (!node) {
    return false;
  }
  return node === parent || hasParent(node.parentElement, parent);
}

export type DetailsProps = {
  summary?: ReactElement;
} & ComponentProps<'details'>;

function Details({summary, children, ...props}: DetailsProps): JSX.Element {
  const isBrowser = useIsBrowser();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const {collapsed, setCollapsed} = useCollapsible({
    initialState: !props.open,
  });
  // We use a separate prop because it must be set only after animation completes
  // Otherwise close anim won't work
  const [open, setOpen] = useState(props.open);

  return (
    <details
      {...props}
      ref={detailsRef}
      open={open}
      data-collapsed={collapsed}
      className={clsx(
        styles.details,
        {[styles.isBrowser]: isBrowser},
        props.className,
      )}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        // Prevent a double-click to highlight summary text
        if (isInSummary(target) && e.detail > 1) {
          e.preventDefault();
        }
      }}
      onClick={(e) => {
        e.stopPropagation(); // For isolation of multiple nested details/summary
        const target = e.target as HTMLElement;
        const shouldToggle =
          isInSummary(target) && hasParent(target, detailsRef.current!);
        if (!shouldToggle) {
          return;
        }
        e.preventDefault();
        if (collapsed) {
          setCollapsed(false);
          setOpen(true);
        } else {
          setCollapsed(true);
          // setOpen(false); // Don't do this, it breaks close animation!
        }
      }}>
      {summary}

      <Collapsible
        lazy={false} // Content might matter for SEO in this case
        collapsed={collapsed}
        disableSSRStyle // Allows component to work fine even with JS disabled!
        onCollapseTransitionEnd={(newCollapsed) => {
          setCollapsed(newCollapsed);
          setOpen(!newCollapsed);
        }}>
        <div className={styles.collapsibleContent}>{children}</div>
      </Collapsible>
    </details>
  );
}

export default Details;
