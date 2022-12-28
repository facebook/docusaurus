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
  useMemo,
} from 'react';
import clsx from 'clsx';
import {useHistory} from '@docusaurus/router';
import {duplicates, useStorageSlot} from '@docusaurus/theme-common';
import {
  useQueryStringValue,
  useScrollPositionBlocker,
} from '@docusaurus/theme-common/internal';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type {Props as TabItemProps} from '@theme/TabItem';
import type {Props, TabValue} from '@theme/Tabs';
import styles from './styles.module.css';

// A very rough duck type, but good enough to guard against mistakes while
// allowing customization
function isTabItem(
  comp: ReactElement<object>,
): comp is ReactElement<TabItemProps> {
  return 'value' in comp.props;
}

function ensureValidChildren(children: Props['children']) {
  return React.Children.map(children, (child) => {
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
}

function extractChildrenTabValues(children: Props['children']): TabValue[] {
  return ensureValidChildren(children).map(
    ({props: {value, label, attributes, default: isDefault}}) => ({
      value,
      label,
      attributes,
      default: isDefault,
    }),
  );
}

function ensureNoDuplicateValue(values: readonly TabValue[]) {
  const dup = duplicates(values, (a, b) => a.value === b.value);
  if (dup.length > 0) {
    throw new Error(
      `Docusaurus error: Duplicate values "${dup
        .map((a) => a.value)
        .join(', ')}" found in <Tabs>. Every value needs to be unique.`,
    );
  }
}

function useTabValues(
  props: Pick<Props, 'values' | 'children'>,
): readonly TabValue[] {
  const {values: valuesProp, children} = props;
  return useMemo(() => {
    const values = valuesProp ?? extractChildrenTabValues(children);
    ensureNoDuplicateValue(values);
    return values;
  }, [valuesProp, children]);
}

function isValidValue({
  value,
  tabValues,
}: {
  value: string | null | undefined;
  tabValues: readonly TabValue[];
}) {
  return tabValues.some((a) => a.value === value);
}

function getInitialStateValue({
  defaultValue,
  tabValues,
}: {
  defaultValue: Props['defaultValue'];
  tabValues: readonly TabValue[];
}): string {
  if (tabValues.length === 0) {
    throw new Error(
      'Docusaurus error: the <Tabs> component requires at least one <TabItem> children component',
    );
  }
  if (defaultValue) {
    // Warn user about passing incorrect defaultValue as prop.
    if (!isValidValue({value: defaultValue, tabValues})) {
      throw new Error(
        `Docusaurus error: The <Tabs> has a defaultValue "${defaultValue}" but none of its children has the corresponding value. Available values are: ${tabValues
          .map((a) => a.value)
          .join(
            ', ',
          )}. If you intend to show no default tab, use defaultValue={null} instead.`,
      );
    }
    return defaultValue;
  } 
    const defaultTabValue =
      tabValues.find((tabValue) => tabValue.default) ?? tabValues[0];
    if (!defaultTabValue) {
      throw new Error('Unexpected error: 0 tabValues');
    }
    return defaultTabValue.value;
  
}

function getStorageKey(groupId: string | undefined) {
  if (!groupId) {
    return null;
  }
  return `docusaurus.tab.${groupId}`;
}

function getQueryStringKey({
  queryString = false,
  groupId,
}: Pick<Props, 'queryString' | 'groupId'>) {
  if (typeof queryString === 'string') {
    return queryString;
  }
  if (queryString === false) {
    return null;
  }
  if (queryString === true && !groupId) {
    throw new Error(
      `Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".`,
    );
  }
  return groupId ?? null;
}

function useTabQueryString({
  queryString = false,
  groupId,
}: Pick<Props, 'queryString' | 'groupId'>) {
  const history = useHistory();

  const key = getQueryStringKey({queryString, groupId});

  const value = useQueryStringValue(key);

  const setValue = useCallback(
    (newValue: string) => {
      if (!key) {
        return; // no-op
      }
      const searchParams = new URLSearchParams(history.location.search);
      searchParams.set(key, newValue);
      history.replace({...history.location, search: searchParams.toString()});
    },
    [key, history],
  );

  return [value, setValue] as const;
}

function useTabStorage({groupId}: Pick<Props, 'groupId'>) {
  const key = getStorageKey(groupId);
  const [value, storageSlot] = useStorageSlot(key);

  const setValue = useCallback(
    (newValue: string) => {
      if (!key) {
        return; // no-op
      }
      storageSlot.set(newValue);
    },
    [key, storageSlot],
  );

  return [value, setValue] as const;
}

function useTabs(props: Props) {
  const {defaultValue, queryString = false, groupId} = props;

  const tabValues = useTabValues(props);

  const [selectedValue, setSelectedValueState] = useState(() =>
    getInitialStateValue({defaultValue, tabValues}),
  );

  const [queryStringValue, setQueryString] = useTabQueryString({
    queryString,
    groupId,
  });

  const [storageValue, setStorageValue] = useTabStorage({
    groupId,
  });

  // We sync valid querystring/storage value to state on change + hydration
  const valueToSync = (() => {
    const value = queryStringValue ?? storageValue;
    if (!isValidValue({value, tabValues})) {
      return null;
    }
    return value;
  })();
  useEffect(() => {
    if (valueToSync) {
      setSelectedValueState(valueToSync);
    }
  }, [valueToSync]);

  const setSelectedValue = useCallback(
    (newValue: string) => {
      if (!isValidValue({value: newValue, tabValues})) {
        throw new Error(`Can't select invalid tab value=${newValue}`);
      }
      setSelectedValueState(newValue);
      setQueryString(newValue);
      setStorageValue(newValue);
    },
    [setQueryString, setStorageValue, tabValues],
  );

  return {selectedValue, setSelectedValue, tabValues};
}

function TabsComponent(props: Props): JSX.Element {
  const {selectedValue, setSelectedValue, tabValues} = useTabs(props);
  return (
    <div className={clsx('tabs-container', styles.tabList)}>
      <TabList
        {...props}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        tabValues={tabValues}
      />
      <TabContent {...props} selectedValue={selectedValue} />
    </div>
  );
}

function TabList({
  className,
  block,
  selectedValue,
  setSelectedValue,
  tabValues,
}: Props & {
  selectedValue: string | null | undefined;
  setSelectedValue: (value: string) => void;
  tabValues: readonly TabValue[];
}) {
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
    const newTabValue = tabValues[newTabIndex]!.value;

    if (newTabValue !== selectedValue) {
      blockElementScrollPositionUntilNextRender(newTab);
      setSelectedValue(newTabValue);
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
      {tabValues.map(({value, label, attributes}) => (
        <li
          // TODO extract TabListItem
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
  );
}

function TabContent({
  lazy,
  children,
  selectedValue,
}: Props & {selectedValue: string | null | undefined}) {
  if (lazy) {
    const selectedTabItem = children.find(
      (tabItem) => tabItem.props.value === selectedValue,
    );
    if (!selectedTabItem) {
      // fail-safe or fail-fast? not sure what's best here
      return null;
    }
    return cloneElement(selectedTabItem, {className: 'margin-top--md'});
  }
  return (
    <div className="margin-top--md">
      {children.map((tabItem, i) =>
        cloneElement(tabItem, {
          key: i,
          hidden: tabItem.props.value !== selectedValue,
        }),
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
