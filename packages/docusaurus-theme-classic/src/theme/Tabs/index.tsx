/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, cloneElement, Children, ReactElement} from 'react';
import useUserPreferencesContext from '@theme/hooks/useUserPreferencesContext';
import type {Props} from '@theme/Tabs';
import type {Props as TabItemProps} from '@theme/TabItem';

import clsx from 'clsx';

import styles from './styles.module.css';

function isInViewport(element: HTMLElement): boolean {
  const {top, left, bottom, right} = element.getBoundingClientRect();
  const {innerHeight, innerWidth} = window;

  return top >= 0 && right <= innerWidth && bottom <= innerHeight && left >= 0;
}

function Tabs(props: Props): JSX.Element {
  const {
    lazy,
    block,
    defaultValue: defaultValueProp,
    values: valuesProp,
    groupId,
    className,
  } = props;
  const children = Children.toArray(
    props.children,
  ) as ReactElement<TabItemProps>[];
  const values =
    valuesProp ??
    children.map((child) => {
      return {
        value: child.props.value,
        label: child.props.label,
      };
    });
  const defaultValue =
    defaultValueProp ??
    children.find((child) => child.props.default)?.props.value;

  const {tabGroupChoices, setTabGroupChoices} = useUserPreferencesContext();
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const tabRefs: (HTMLLIElement | null)[] = [];

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

  const handleTabChange = (
    event: React.FocusEvent<HTMLLIElement> | React.MouseEvent<HTMLLIElement>,
  ) => {
    const selectedTab = event.currentTarget;
    const selectedTabIndex = tabRefs.indexOf(selectedTab);
    const selectedTabValue = values[selectedTabIndex].value;

    setSelectedValue(selectedTabValue);

    if (groupId != null) {
      setTabGroupChoices(groupId, selectedTabValue);

      setTimeout(() => {
        if (isInViewport(selectedTab)) {
          return;
        }

        selectedTab.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });

        selectedTab.classList.add(styles.tabItemActive);
        setTimeout(
          () => selectedTab.classList.remove(styles.tabItemActive),
          2000,
        );
      }, 150);
    }
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    let focusElement: HTMLLIElement | null = null;

    switch (event.key) {
      case 'ArrowRight': {
        const nextTab = tabRefs.indexOf(event.target as HTMLLIElement) + 1;
        focusElement = tabRefs[nextTab] || tabRefs[0];
        break;
      }
      case 'ArrowLeft': {
        const prevTab = tabRefs.indexOf(event.target as HTMLLIElement) - 1;
        focusElement = tabRefs[prevTab] || tabRefs[tabRefs.length - 1];
        break;
      }
      default:
        break;
    }

    focusElement?.focus();
  };

  return (
    <div className="tabs-container">
      <ul
        role="tablist"
        aria-orientation="horizontal"
        className={clsx(
          'tabs',
          {
            'tabs--block': block,
          },
          className,
        )}>
        {values.map(({value, label}) => (
          <li
            role="tab"
            tabIndex={selectedValue === value ? 0 : -1}
            aria-selected={selectedValue === value}
            className={clsx('tabs__item', styles.tabItem, {
              'tabs__item--active': selectedValue === value,
            })}
            key={value}
            ref={(tabControl) => tabRefs.push(tabControl)}
            onKeyDown={handleKeydown}
            onFocus={handleTabChange}
            onClick={handleTabChange}>
            {label ?? value}
          </li>
        ))}
      </ul>

      {lazy ? (
        cloneElement(
          children.filter(
            (tabItem) => tabItem.props.value === selectedValue,
          )[0],
          {className: 'margin-vert--md'},
        )
      ) : (
        <div className="margin-vert--md">
          {children.map((tabItem, i) =>
            cloneElement(tabItem, {
              key: i,
              hidden: tabItem.props.value !== selectedValue,
            }),
          )}
        </div>
      )}
    </div>
  );
}

export default Tabs;
