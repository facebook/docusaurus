/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import {useNavbarSecondaryMenuContent} from './navbarSecondaryMenu/content';
import {useWindowSize} from '../hooks/useWindowSize';
import {useHistoryPopHandler} from '../utils/historyUtils';
import {useThemeConfig} from '../utils/useThemeConfig';
import {ReactContextError} from '../utils/reactUtils';

type ContextValue = {
  /**
   * Mobile sidebar should be disabled in case it's empty, i.e. no secondary
   * menu + no navbar items). If disabled, the toggle button should not be
   * displayed at all.
   */
  disabled: boolean;
  /**
   * Signals whether the actual sidebar should be displayed (contrary to
   * `disabled` which is about the toggle button). Sidebar should not visible
   * until user interaction to avoid SSR rendering.
   */
  shouldRender: boolean;
  /** The displayed state. Can be toggled with the `toggle` callback. */
  shown: boolean;
  /** Toggle the `shown` attribute. */
  toggle: () => void;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useIsNavbarMobileSidebarDisabled() {
  const secondaryMenuContent = useNavbarSecondaryMenuContent();
  const {items} = useThemeConfig().navbar;
  return items.length === 0 && !secondaryMenuContent.component;
}

function useContextValue(): ContextValue {
  const disabled = useIsNavbarMobileSidebarDisabled();
  const windowSize = useWindowSize();

  const shouldRender = !disabled && windowSize === 'mobile';

  const [shown, setShown] = useState(false);

  // Close mobile sidebar on navigation pop
  // Most likely firing when using the Android back button (but not only)
  useHistoryPopHandler(() => {
    if (shown) {
      setShown(false);
      // Prevent pop navigation; seems desirable enough
      // See https://github.com/facebook/docusaurus/pull/5462#issuecomment-911699846
      return false;
    }
    return undefined;
  });

  const toggle = useCallback(() => {
    setShown((s) => !s);
  }, []);

  useEffect(() => {
    if (windowSize === 'desktop') {
      setShown(false);
    }
  }, [windowSize]);

  return useMemo(
    () => ({disabled, shouldRender, toggle, shown}),
    [disabled, shouldRender, toggle, shown],
  );
}

export function NavbarMobileSidebarProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const value = useContextValue();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useNavbarMobileSidebar(): ContextValue {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new ReactContextError('NavbarMobileSidebarProvider');
  }
  return context;
}
