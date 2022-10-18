/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useState,
  cloneElement,
  isValidElement,
  type ReactElement,
} from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {duplicates} from '@docusaurus/theme-common';
import {
  useScrollPositionBlocker,
  useTabGroupChoice,
} from '@docusaurus/theme-common/internal';
import type {Props} from '@theme/Tabs';
import type {Props as TabItemProps} from '@theme/TabItem';

import styles from './styles.module.css';

// A very rough duck type, but good enough to guard against mistakes while
// allowing customization
function isTabItem(
  comp: ReactElement<object>,
): comp is ReactElement<TabItemProps> {
  return 'value' in comp.props;
}

const NON_GROUP_TAB_KEY = '__noGroup__';
function getValueFromSearchParams(groupId = NON_GROUP_TAB_KEY): string | null {
  const searchParams = new URLSearchParams(window.location.search);
  const prevSearchParams = searchParams.get('tabs');
  return prevSearchParams ? JSON.parse(prevSearchParams)[groupId] : null;
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
  const children = React.Children.map(props.children, (child) => {
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
    valuesProp ??
    // Only pick keys that we recognize. MDX would inject some keys by default
    children.map(({props: {value, label, attributes}}) => ({
      value,
      label,
      attributes,
    }));
  const dup = duplicates(values, (a, b) => a.value === b.value);
  if (dup.length > 0) {
    throw new Error(
      `Docusaurus error: Duplicate values "${dup
        .map((a) => a.value)
        .join(', ')}" found in <Tabs>. Every value needs to be unique.`,
    );
  }

  const {tabGroupChoices, setTabGroupChoices} = useTabGroupChoice();
  // search params >
  // local storage >
  // specified defaultValue >
  // first child with "default" attr >
  // first tab item.
  let defaultValue: string | null | undefined =
    getValueFromSearchParams(groupId);
  if (!defaultValue && groupId != null) {
    const relevantTabGroupChoice = tabGroupChoices[groupId];
    if (
      relevantTabGroupChoice != null &&
      relevantTabGroupChoice !== defaultValue &&
      values.some((value) => value.value === relevantTabGroupChoice)
    ) {
      defaultValue = relevantTabGroupChoice;
    }
  }
  // If we didn't find the right value in search params or local storage,
  // fallback to props > child with "default" specified > first tab.
  if (!defaultValue || !values.some((a) => a.value === defaultValue)) {
    defaultValue =
      defaultValueProp !== undefined
        ? defaultValueProp
        : children.find((child) => child.props.default)?.props.value ??
          children[0]!.props.value;
  }

  // Warn user about passing incorrect defaultValue as prop.
  if (
    defaultValueProp !== null &&
    defaultValueProp !== undefined &&
    !values.some((a) => a.value === defaultValueProp)
  ) {
    throw new Error(
      `Docusaurus error: The <Tabs> has a defaultValue "${defaultValue}" but none of its children has the corresponding value. Available values are: ${values
        .map((a) => a.value)
        .join(
          ', ',
        )}. If you intend to show no default tab, use defaultValue={null} instead.`,
    );
  }

  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const tabRefs: (HTMLLIElement | null)[] = [];
  const {blockElementScrollPositionUntilNextRender} =
    useScrollPositionBlocker();

  const handleTabChange = (
    event:
      | React.FocusEvent<HTMLLIElement>
      | React.MouseEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLLIElement>,
  ) => {
    const newTab = event.currentTarget;
    const newTabIndex = tabRefs.indexOf(newTab);
    const newTabValue = values[newTabIndex]!.value;

    if (newTabValue !== selectedValue) {
      blockElementScrollPositionUntilNextRender(newTab);
      setSelectedValue(newTabValue);

      const searchParams = new URLSearchParams(window.location.search);
      const prevSearchParams = searchParams.get('tabs');
      const prevVal = prevSearchParams ? JSON.parse(prevSearchParams) : null;
      const newVal = {[groupId || NON_GROUP_TAB_KEY]: newTabValue};
      const url = new URL(window.location.origin + window.location.pathname);
      searchParams.set(
        'tabs',
        JSON.stringify(prevVal ? {...prevVal, ...newVal} : newVal),
      );
      url.search = searchParams.toString();
      window.history.replaceState({}, '', url);

      if (groupId != null) {
        setTabGroupChoices(groupId, String(newTabValue));
      }
    }
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    let focusElement: HTMLLIElement | null = null;

    switch (event.key) {
      case 'Enter': {
        handleTabChange(event);
        break;
      }
      case 'ArrowRight': {
        const nextTab = tabRefs.indexOf(event.currentTarget) + 1;
        focusElement = tabRefs[nextTab] ?? tabRefs[0]!;
        break;
      }
      case 'ArrowLeft': {
        const prevTab = tabRefs.indexOf(event.currentTarget) - 1;
        focusElement = tabRefs[prevTab] ?? tabRefs[tabRefs.length - 1]!;
        break;
      }
      default:
        break;
    }

    focusElement?.focus();
  };

  return (
    <div className={clsx('tabs-container', styles.tabList)}>
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
        {values.map(({value, label, attributes}) => (
          <li
            role="tab"
            tabIndex={selectedValue === value ? 0 : -1}
            aria-selected={selectedValue === value}
            key={value}
            ref={(tabControl) => tabRefs.push(tabControl)}
            onKeyDown={handleKeydown}
            onClick={handleTabChange}
            {...attributes}
            className={clsx(
              'tabs__item',
              styles.tabItem,
              attributes?.className as string,
              {
                'tabs__item--active': selectedValue === value,
              },
            )}>
            {label ?? value}
          </li>
        ))}
      </ul>

      {lazy ? (
        cloneElement(
          children.filter(
            (tabItem) => tabItem.props.value === selectedValue,
          )[0]!,
          {className: 'margin-top--md'},
        )
      ) : (
        <div className="margin-top--md">
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
