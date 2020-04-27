/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, Children, ReactNode} from 'react';
import useUserPreferencesContext from '@theme/hooks/useUserPreferencesContext';

import clsx from 'clsx';

import styles from './styles.module.css';

const keys = {
  left: 37,
  right: 39,
};

type Props = {
  block?: boolean;
  children: ReactNode;
  defaultValue?: string;
  values: {value: string; label: string}[];
  groupId?: string;
};

function Tabs(props: Props): JSX.Element {
  const {block, children, defaultValue, values, groupId} = props;
  const {tabGroupChoices, setTabGroupChoices} = useUserPreferencesContext();
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  if (groupId != null) {
    const relevantTabGroupChoice = tabGroupChoices[groupId];
    if (
      relevantTabGroupChoice != null &&
      relevantTabGroupChoice !== selectedValue &&
      values.some((value) => value.value === relevantTabGroupChoice)
    ) {
      setSelectedValue(relevantTabGroupChoice);
    }
  }

  const changeSelectedValue = (newValue) => {
    setSelectedValue(newValue);
    if (groupId != null) {
      setTabGroupChoices(groupId, newValue);
    }
  };

  const tabRefs: (HTMLLIElement | null)[] = [];

  const focusNextTab = (tabs, target) => {
    const next = tabs.indexOf(target) + 1;

    if (!tabs[next]) {
      tabs[0].focus();
    } else {
      tabs[next].focus();
    }
  };

  const focusPreviousTab = (tabs, target) => {
    const prev = tabs.indexOf(target) - 1;

    if (!tabs[prev]) {
      tabs[tabs.length - 1].focus();
    } else {
      tabs[prev].focus();
    }
  };

  const handleKeydown = (tabs, target, event) => {
    switch (event.keyCode) {
      case keys.right:
        focusNextTab(tabs, target);
        break;
      case keys.left:
        focusPreviousTab(tabs, target);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <ul
        role="tablist"
        aria-orientation="horizontal"
        className={clsx('tabs', {
          'tabs--block': block,
        })}>
        {values.map(({value, label}) => (
          <li
            role="tab"
            tabIndex={0}
            aria-selected={selectedValue === value}
            className={clsx('tabs__item', styles.tabItem, {
              'tabs__item--active': selectedValue === value,
            })}
            key={value}
            ref={(tabControl) => tabRefs.push(tabControl)}
            onKeyDown={(event) => handleKeydown(tabRefs, event.target, event)}
            onFocus={() => changeSelectedValue(value)}
            onClick={() => changeSelectedValue(value)}>
            {label}
          </li>
        ))}
      </ul>
      <div role="tabpanel" className="margin-vert--md">
        {
          Children.toArray(children).filter(
            (child) =>
              (child as React.Component<{value: string}>).props.value ===
              selectedValue,
          )[0]
        }
      </div>
    </div>
  );
}

export default Tabs;
