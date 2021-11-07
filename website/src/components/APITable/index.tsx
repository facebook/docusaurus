/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  Children,
  ComponentProps,
  ReactElement,
  ReactNode,
  isValidElement,
  useRef,
  useEffect,
} from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './styles.module.css';

interface Props {
  readonly children: ReactElement<ComponentProps<'table'>>;
  readonly name?: string;
}

// ReactNode equivalent of HTMLElement#innerText
function getText(node: ReactElement): string {
  let curNode: ReactNode = node;
  while (isValidElement(curNode)) {
    [curNode] = Children.toArray(curNode.props.children);
  }
  return curNode as string;
}

/*
 * Note: this is not a quite robust component since it makes a lot of
 * assumptions about how the children looks; however, those assumptions
 * should be generally correct in the MDX context.
 */
export default function APITable({children, name}: Props): JSX.Element {
  const isBrowser = useIsBrowser();
  const [thead, tbody] = Children.toArray(
    children.props.children,
  ) as ReactElement[];
  const highlightedRow = useRef<HTMLTableRowElement>(null);
  const rows = Children.map(
    tbody.props.children,
    (row: ReactElement<ComponentProps<'tr'>>) => {
      const entryName = getText(row);
      const anchor = name ? `#${name}-${entryName}` : `#${entryName}`;
      return (
        <tr
          id={entryName}
          tabIndex={0}
          ref={
            isBrowser && window.location.href.includes(anchor)
              ? highlightedRow
              : undefined
          }
          onClick={() => {
            window.location.href = anchor;
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
              window.location.href = anchor;
            }
          }}>
          {row.props.children}
        </tr>
      );
    },
  );
  useEffect(() => {
    highlightedRow.current?.focus();
  }, [highlightedRow]);

  return (
    <table className={styles.apiTable}>
      {thead}
      <tbody>{rows}</tbody>
    </table>
  );
}
