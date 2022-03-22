/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {useWindowSize} from '../hooks/useWindowSize';
import {useHistoryPopHandler} from '../utils/historyUtils';
import {useActivePlugin} from '@docusaurus/plugin-content-docs/client';
import {useThemeConfig} from '../utils/useThemeConfig';
import {ReactContextError} from '../utils/reactUtils';

type NavbarMobileSidebarContextValue = {
  disabled: boolean;
  shouldRender: boolean;
  toggle: () => void;
  shown: boolean;
};

const Context = React.createContext<
  NavbarMobileSidebarContextValue | undefined
>(undefined);

// Mobile sidebar can be disabled in case it would lead to an empty sidebar
// In this case it's not useful to display a navbar sidebar toggle button
function useNavbarMobileSidebarDisabled() {
  const activeDocPlugin = useActivePlugin();
  const {items} = useThemeConfig().navbar;
  return items.length === 0 && !activeDocPlugin;
}

function useNavbarMobileSidebarContextValue(): NavbarMobileSidebarContextValue {
  const disabled = useNavbarMobileSidebarDisabled();
  const windowSize = useWindowSize();

  // Mobile sidebar not visible until user interaction: can avoid SSR rendering
  const shouldRender = !disabled && windowSize === 'mobile'; // || windowSize === 'ssr';

  const [shown, setShown] = useState(false);

  // Close mobile sidebar on navigation pop
  // Most likely firing when using the Android back button (but not only)
  useHistoryPopHandler(() => {
    if (shown) {
      setShown(false);
      // Should we prevent the navigation here?
      // See https://github.com/facebook/docusaurus/pull/5462#issuecomment-911699846
      return false; // prevent pop navigation
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

  // Return stable context value
  return useMemo(
    () => ({
      disabled,
      shouldRender,
      toggle,
      shown,
    }),
    [disabled, shouldRender, toggle, shown],
  );
}

export function NavbarMobileSidebarProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const value = useNavbarMobileSidebarContextValue();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useNavbarMobileSidebar(): NavbarMobileSidebarContextValue {
  const context = React.useContext(Context);
  if (context == null) {
    throw new ReactContextError('NavbarMobileSidebarProvider');
  }
  return context;
}
