/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useState,
  ReactNode,
  useContext,
  createContext,
  useEffect,
  ComponentType,
  useMemo,
} from 'react';

/*
The idea behind all this is that a specific component must be able to fill a placeholder in the generic layout
The doc page should be able to fill the secondary menu of the main mobile navbar.
This permits to reduce coupling between the main layout and the specific page.

This kind of feature is often called portal/teleport/gateway... various unmaintained React libs exist
Most up-to-date one: https://github.com/gregberge/react-teleporter
Not sure any of those is safe regarding concurrent mode.
 */

type ExtraProps = {
  toggleSidebar: () => void;
};

export type MobileSecondaryMenuComponent<Props> = ComponentType<
  Props & ExtraProps
>;

type State = {
  component: MobileSecondaryMenuComponent<unknown>;
  props: unknown;
} | null;

function useContextValue() {
  return useState<State>(null);
}

type ContextValue = ReturnType<typeof useContextValue>;

const Context = createContext<ContextValue | null>(null);

export function MobileSecondaryMenuProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <Context.Provider value={useContextValue()}>{children}</Context.Provider>
  );
}

function useMobileSecondaryMenuContext(): ContextValue {
  const value = useContext(Context);
  if (value === null) {
    throw new Error(
      'MobileSecondaryMenuProvider was not used correctly, context value is null',
    );
  }
  return value;
}

export function useMobileSecondaryMenuRenderer(): (
  extraProps: ExtraProps,
) => ReactNode | undefined {
  const [state] = useMobileSecondaryMenuContext();
  if (state) {
    const Comp = state.component;
    return function render(extraProps) {
      return <Comp {...state.props} {...extraProps} />;
    };
  }
  return () => undefined;
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
export function MobileSecondaryMenuFiller<
  Props extends Record<string, unknown>,
>({
  component,
  props,
}: {
  component: MobileSecondaryMenuComponent<Props & ExtraProps>;
  props: Props;
}): JSX.Element | null {
  const [, setState] = useMobileSecondaryMenuContext();

  // To avoid useless context re-renders, props are memoized shallowly
  const memoizedProps = useShallowMemoizedObject(props);

  useEffect(() => {
    // @ts-expect-error: context is not 100% typesafe but it's ok
    setState({component, props: memoizedProps});
  }, [setState, component, memoizedProps]);

  useEffect(() => () => setState(null), [setState]);

  return null;
}
