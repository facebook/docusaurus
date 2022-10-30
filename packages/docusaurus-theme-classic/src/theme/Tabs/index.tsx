/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useState,
  type ReactElement,
} from 'react';
import clsx from 'clsx';
import {useHistory, useLocation} from '@docusaurus/router';
import {duplicates} from '@docusaurus/theme-common';
import {
  useScrollPositionBlocker,
  useTabGroupChoice,
} from '@docusaurus/theme-common/internal';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type {Props as TabItemProps} from '@theme/TabItem';
import type {Props} from '@theme/Tabs';
import styles from './styles.module.css';

// A very rough duck type, but good enough to guard against mistakes while
// allowing customization
function isTabItem(
  comp: ReactElement<object>,
): comp is ReactElement<TabItemProps> {
  return 'value' in comp.props;
}

const getSearchKey = (queryString?: string | boolean, groupId = '') =>
  typeof queryString === 'string' ? queryString : groupId;
const useTabQueryString = () => {
  const location = useLocation();
  const history = useHistory();

  const get = useCallback(
    (queryString?: string | boolean, groupId = '') => {
      const searchKey = getSearchKey(queryString, groupId);
      return new URLSearchParams(location.search).get(searchKey);
    },
    [location.search],
  );
  const set = useCallback(
    (newTabValue: string, queryString: string | boolean, groupId = '') => {
      const searchKey = getSearchKey(queryString, groupId);
      const searchParams = new URLSearchParams(location.search);
      searchParams.set(searchKey, newTabValue);
      history.replace({...location, search: searchParams.toString()});
    },
    [history, location],
  );

  return {get, set};
};

function TabsComponent(props: Props): JSX.Element {
  const {
    lazy,
    block,
    defaultValue: defaultValueProp,
    values: valuesProp,
    groupId,
    className,
    queryString = false,
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
  const tabQueryString = useTabQueryString();
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

  // Warn user about passing incorrect defaultValue as prop.
  if (
    defaultValueProp !== null &&
    defaultValueProp !== undefined &&
    !values.some((a) => a.value === defaultValueProp)
  ) {
    throw new Error(
      `Docusaurus error: The <Tabs> has a defaultValue "${defaultValueProp}" but none of its children has the corresponding value. Available values are: ${values
        .map((a) => a.value)
        .join(
          ', ',
        )}. If you intend to show no default tab, use defaultValue={null} instead.`,
    );
  }

  if (queryString === true && !groupId) {
    throw new Error(
      `Docusaurus error: The <Tabs> component needs to have groupId specified if queryString is true.`,
    );
  }

  const {tabGroupChoices, setTabGroupChoices} = useTabGroupChoice();
  // local storage >
  // specified defaultValue >
  // first child with "default" attr >
  // first tab item.
  let defaultValue: string | null | undefined;
  // If we didn't find the right value in search params or local storage,
  // fallback to props > child with "default" specified > first tab.
  if (!defaultValue || !values.some((a) => a.value === defaultValue)) {
    defaultValue =
      defaultValueProp !== undefined
        ? defaultValueProp
        : children.find((child) => child.props.default)?.props.value ??
          children[0]!.props.value;
  }

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

      if (queryString) {
        tabQueryString.set(newTabValue, queryString, groupId);
      }

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
  useEffect(() => {
    if (queryString) {
      const queryValue = tabQueryString.get(queryString, groupId);
      if (queryValue) {
        setSelectedValue(queryValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
