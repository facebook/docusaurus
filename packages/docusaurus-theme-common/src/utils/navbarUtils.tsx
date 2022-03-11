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
import useWindowSize from '../hooks/useWindowSize';
import {useHistoryPopHandler} from './historyUtils';
import {useMobileSecondaryMenuRenderer} from './mobileSecondaryMenu';
import {usePrevious} from './usePrevious';
import {useActivePlugin} from '@docusaurus/plugin-content-docs/client';
import {useThemeConfig} from './useThemeConfig';
import {ReactContextError} from './reactUtils';

const DefaultNavItemPosition = 'right';

// If split links by left/right
// if position is unspecified, fallback to right
export function splitNavbarItems<
  // TODO BAD, temporary type hack
  T extends {position?: 'left' | 'right'},
>(items: T[]): [leftItems: T[], rightItems: T[]] {
  function isLeft(item: T): boolean {
    return (item.position ?? DefaultNavItemPosition) === 'left';
  }

  const leftItems = items.filter(isLeft);
  const rightItems = items.filter((item) => !isLeft(item));

  return [leftItems, rightItems];
}

type NavbarMobileSidebarContextValue = {
  disabled: boolean;
  shouldRender: boolean;
  toggle: () => void;
  shown: boolean;
};

const NavbarMobileSidebarContext = React.createContext<
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
  return (
    <NavbarMobileSidebarContext.Provider
      value={useNavbarMobileSidebarContextValue()}>
      {children}
    </NavbarMobileSidebarContext.Provider>
  );
}

export function useNavbarMobileSidebar(): NavbarMobileSidebarContextValue {
  const context = React.useContext(NavbarMobileSidebarContext);
  if (context == null) {
    throw new ReactContextError('NavbarMobileSidebarProvider');
  }
  return context;
}

export function useNavbarSecondaryMenu(): {
  shown: boolean;
  hide: () => void;
  content: ReactNode;
} {
  const mobileSidebar = useNavbarMobileSidebar();

  const content = useMobileSecondaryMenuRenderer()?.({
    toggleSidebar: mobileSidebar.toggle,
  });
  const previousContent = usePrevious(content);

  const [shown, setShown] = useState<boolean>(
    () =>
      // /!\ content is set with useEffect,
      // so it's not available on mount anyway
      // "return !!content" => always returns false
      false,
  );

  // When content is become available for the first time (set in useEffect)
  // we set this content to be shown!
  useEffect(() => {
    const contentBecameAvailable = content && !previousContent;
    if (contentBecameAvailable) {
      setShown(true);
    }
  }, [content, previousContent]);

  const hasContent = !!content;

  // On sidebar close, secondary menu is set to be shown on next re-opening
  // (if any secondary menu content available)
  useEffect(() => {
    if (!hasContent) {
      setShown(false);
      return;
    }
    if (!mobileSidebar.shown) {
      setShown(true);
    }
  }, [mobileSidebar.shown, hasContent]);

  const hide = useCallback(() => {
    setShown(false);
  }, []);

  return useMemo(
    () => ({
      shown,
      hide,
      content,
    }),
    [shown, hide, content],
  );
}
