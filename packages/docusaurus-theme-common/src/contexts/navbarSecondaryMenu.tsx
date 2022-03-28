/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
  type ComponentType,
} from 'react';
import {ReactContextError, usePrevious} from '../utils/reactUtils';
import {useNavbarMobileSidebar} from './navbarMobileSidebar';

export type NavbarSecondaryMenuComponent<Props> = ComponentType<Props>;

type State = {
  shown: boolean;
  content:
    | {
        component: NavbarSecondaryMenuComponent<object>;
        props: object;
      }
    | {component: null; props: null};
};

const InitialState: State = {
  shown: false,
  content: {component: null, props: null},
};

type ContextValue = [
  state: State,
  setState: React.Dispatch<React.SetStateAction<State>>,
];

const Context = React.createContext<ContextValue | null>(null);

function useContextValue(): ContextValue {
  const mobileSidebar = useNavbarMobileSidebar();

  const [state, setState] = useState<State>(InitialState);

  const setShown = (shown: boolean) => setState((s) => ({...s, shown}));

  const hasContent = state.content?.component !== null;
  const previousHasContent = usePrevious(state.content?.component !== null);

  // When content is become available for the first time (set in useEffect)
  // we set this content to be shown!
  useEffect(() => {
    const contentBecameAvailable = hasContent && !previousHasContent;
    if (contentBecameAvailable) {
      setShown(true);
    }
  }, [hasContent, previousHasContent]);

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

  return [state, setState];
}

export function NavbarSecondaryMenuProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const value = useContextValue();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

function useNavbarSecondaryMenuContext(): ContextValue {
  const value = useContext(Context);
  if (value === null) {
    throw new ReactContextError('MobileSecondaryMenuProvider');
  }
  return value;
}

function useShallowMemoizedObject<O>(obj: O) {
  return useMemo(
    () => obj,
    // Is this safe?
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.keys(obj), ...Object.values(obj)],
  );
}

/**
 * This component renders nothing by itself, but it fills the placeholder in the
 * generic secondary menu layout. This reduces coupling between the main layout
 * and the specific page.
 *
 * This kind of feature is often called portal/teleport/gateway/outlet...
 * Various unmaintained React libs exist. Most up-to-date one:
 * https://github.com/gregberge/react-teleporter
 * Not sure any of those is safe regarding concurrent mode.
 */
export function NavbarSecondaryMenuFiller<P extends object>({
  component,
  props,
}: {
  component: NavbarSecondaryMenuComponent<P>;
  props: P;
}): JSX.Element | null {
  const [, setState] = useNavbarSecondaryMenuContext();

  // To avoid useless context re-renders, props are memoized shallowly
  const memoizedProps = useShallowMemoizedObject(props);

  useEffect(() => {
    // @ts-expect-error: context is not 100% type-safe but it's ok
    setState((s) => ({...s, content: {component, props: memoizedProps}}));
  }, [setState, component, memoizedProps]);

  useEffect(
    () => () => setState((s) => ({...s, component: null, props: null})),
    [setState],
  );

  return null;
}

function renderElement(state: State): JSX.Element | undefined {
  if (state.content?.component) {
    const Comp = state.content.component;
    return <Comp {...state.content.props} />;
  }
  return undefined;
}

/** Wires the logic for rendering the mobile navbar secondary menu. */
export function useNavbarSecondaryMenu(): {
  /** Whether secondary menu is displayed. */
  shown: boolean;
  /**
   * Hide the secondary menu; fired either when hiding the entire sidebar, or
   * when going back to the primary menu.
   */
  hide: () => void;
  /** The content returned from the current secondary menu filler. */
  content: JSX.Element | undefined;
} {
  const [state, setState] = useNavbarSecondaryMenuContext();

  const hide = useCallback(
    () => setState((s) => ({...s, shown: false})),
    [setState],
  );

  return useMemo(
    () => ({shown: state.shown, hide, content: renderElement(state)}),
    [hide, state],
  );
}
