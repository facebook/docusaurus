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
import {ReactContextError} from './reactUtils';
import {usePrevious} from './usePrevious';
import {useNavbarMobileSidebar} from './navbarUtils';

/*
The idea behind all this is that a specific component must be able to fill a
placeholder in the generic layout. The doc page should be able to fill the
secondary menu of the main mobile navbar. This permits to reduce coupling
between the main layout and the specific page.

This kind of feature is often called portal/teleport/gateway... various
unmaintained React libs exist. Most up-to-date one: https://github.com/gregberge/react-teleporter
Not sure any of those is safe regarding concurrent mode.
 */

export type NavbarSecondaryMenuComponent<Props> = ComponentType<Props>;

type State = {
  shown: boolean;
  content:
    | {
        component: ComponentType<object>;
        props: object;
      }
    | {component: null; props: null};
};

const InitialState: State = {
  shown: false,
  content: {component: null, props: null},
};

function useContextValue() {
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

  return [state, setState] as const;
}

type ContextValue = ReturnType<typeof useContextValue>;

const Context = React.createContext<ContextValue | null>(null);

export function NavbarSecondaryMenuProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <Context.Provider value={useContextValue()}>{children}</Context.Provider>
  );
}

function useNavbarSecondaryMenuContext(): ContextValue {
  const value = useContext(Context);
  if (value === null) {
    throw new ReactContextError('MobileSecondaryMenuProvider');
  }
  return value;
}

function useShallowMemoizedObject<O extends Record<string, unknown>>(obj: O) {
  return useMemo(
    () => obj,
    // Is this safe?
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.keys(obj), ...Object.values(obj)],
  );
}

// Fill the secondary menu placeholder with some real content
export function NavbarSecondaryMenuFiller<
  Props extends Record<string, unknown>,
>({
  component,
  props,
}: {
  component: NavbarSecondaryMenuComponent<Props>;
  props: Props;
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

export function useNavbarSecondaryMenu(): {
  shown: boolean;
  hide: () => void;
  content: JSX.Element | undefined;
} {
  const [state, setState] = useNavbarSecondaryMenuContext();

  const hide = useCallback(
    () => setState((s) => ({...s, shown: false})),
    [setState],
  );

  return useMemo(
    () => ({
      shown: state.shown,
      hide,
      content: renderElement(state),
    }),
    [hide, state],
  );
}
