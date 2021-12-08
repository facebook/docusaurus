/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useState,
  cloneElement,
  Children,
  isValidElement,
  ReactElement,
} from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import useUserPreferencesContext from '@theme/hooks/useUserPreferencesContext';
import {useScrollPositionBlocker, duplicates} from '@docusaurus/theme-common';
import type {Props} from '@theme/Tabs';
import type {Props as TabItemProps} from '@theme/TabItem';

import clsx from 'clsx';

import styles from './styles.module.css';

// A very rough duck type, but good enough to guard against mistakes while
// allowing customization
function isTabItem(comp: ReactElement): comp is ReactElement<TabItemProps> {
  return typeof comp.props.value !== 'undefined';
}

function TabsComponent(props: Props): JSX.Element {
  const {
    lazy,
    block,
    defaultValue: defaultValueProp,
    values: valuesProp,
    groupId,
    className,
  } = props;
  const children = Children.map(props.children, (child) => {
    if (isValidElement(child) && isTabItem(child)) {
      return child;
    }
    // child.type.name will give non-sensical values in prod because of
    // minification, but we assume it won't throw in prod.
    throw new Error(
      `Docusaurus error: Bad <Tabs> child <${
        // @ts-expect-error: guarding against unexpected cases
        typeof child.type === 'string' ? child.type : child.type.name
      }>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`,
    );
  });
  const values =
    valuesProp ?? children.map(({props: {value, label}}) => ({value, label}));
  const dup = duplicates(values, (a, b) => a.value === b.value);
  if (dup.length > 0) {
    throw new Error(
      `Docusaurus error: Duplicate values "${dup
        .map((a) => a.value)
        .join(', ')}" found in <Tabs>. Every value needs to be unique.`,
    );
  }
  // When defaultValueProp is null, don't show a default tab
  const defaultValue =
    defaultValueProp === null
      ? defaultValueProp
      : defaultValueProp ??
        children.find((child) => child.props.default)?.props.value ??
        children[0]?.props.value;
  if (defaultValue !== null && !values.some((a) => a.value === defaultValue)) {
    throw new Error(
      `Docusaurus error: The <Tabs> has a defaultValue "${defaultValue}" but none of its children has the corresponding value. Available values are: ${values
        .map((a) => a.value)
        .join(
          ', ',
        )}. If you intend to show no default tab, use defaultValue={null} instead.`,
    );
  }

  const {tabGroupChoices, setTabGroupChoices} = useUserPreferencesContext();
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const tabRefs: (HTMLLIElement | null)[] = [];
  const {blockElementScrollPositionUntilNextRender} =
    useScrollPositionBlocker();

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
    const newTab = event.currentTarget;
    const newTabIndex = tabRefs.indexOf(newTab);
    const newTabValue = values[newTabIndex].value;

    if (newTabValue !== selectedValue) {
      blockElementScrollPositionUntilNextRender(newTab);
      setSelectedValue(newTabValue);

      if (groupId != null) {
        setTabGroupChoices(groupId, newTabValue);
      }
    }
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    let focusElement: HTMLLIElement | null = null;

    switch (event.key) {
      case 'ArrowRight': {
        const nextTab = tabRefs.indexOf(event.currentTarget) + 1;
        focusElement = tabRefs[nextTab] || tabRefs[0];
        break;
      }
      case 'ArrowLeft': {
        const prevTab = tabRefs.indexOf(event.currentTarget) - 1;
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

export default function Tabs(props: Props): JSX.Element {
  const isBrowser = useIsBrowser();
  return (
    <TabsComponent
      // Remount tabs after hydration
      // Temporary fix for https://github.com/facebook/docusaurus/issues/5653
      key={String(isBrowser)}
      {...props}
    />
  );
}
