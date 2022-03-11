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
  type ReactNode,
  type ComponentType,
} from 'react';
import {ReactContextError} from './reactUtils';

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

type State<Props extends object = object> = {
  component: ComponentType<Props>;
  props: Props;
} | null;

function useContextValue() {
  return useState<State>(null);
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

export function useNavbarSecondaryMenuElement(): ReactNode | undefined {
  const [state] = useNavbarSecondaryMenuContext();
  if (state) {
    const Comp = state.component;
    return <Comp {...state.props} />;
  }
  return undefined;
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
    setState({component, props: memoizedProps});
  }, [setState, component, memoizedProps]);

  useEffect(() => () => setState(null), [setState]);

  return null;
}
