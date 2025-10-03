/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface Props {
  readonly value: string;
  readonly label: string | undefined;
  readonly attributes: {[key: string]: unknown} | undefined;
  readonly selected: boolean;
  readonly tabRef: (node: HTMLLIElement | null) => void;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLLIElement>) => void;
  readonly onClick: (
    event:
      | React.FocusEvent<HTMLLIElement>
      | React.MouseEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLLIElement>,
  ) => void;
}

export default function TabListItem({
  value,
  label,
  attributes,
  selected,
  tabRef,
  onKeyDown,
  onClick,
}: Props): ReactNode {
  return (
    <li
      role="tab"
      tabIndex={selected ? 0 : -1}
      aria-selected={selected}
      ref={tabRef}
      onKeyDown={onKeyDown}
      onClick={onClick}
      {...attributes}
      className={clsx(
        'tabs__item',
        styles.tabItem,
        attributes?.className as string,
        {
          'tabs__item--active': selected,
        },
      )}>
      {label ?? value}
    </li>
  );
}
