/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useMemo, type ReactNode} from 'react';
import type {PluginRouteContext, RouteContext} from '@docusaurus/types';

export const Context = React.createContext<PluginRouteContext | null>(null);

function mergeContexts({
  parent,
  value,
}: {
  parent: PluginRouteContext | null;
  value: RouteContext | null;
}): PluginRouteContext {
  if (!parent) {
    if (!value) {
      throw new Error(
        'Unexpected: no Docusaurus parent/current route context found',
      );
    } else if (!('plugin' in value)) {
      throw new Error(
        'Unexpected: Docusaurus parent route context has no plugin attribute',
      );
    }
    return value;
  }

  // TODO deep merge this
  const data = {...parent.data, ...value?.data};

  return {
    // nested routes are not supposed to override plugin attribute
    plugin: parent.plugin,
    data,
  };
}

export function RouteContextProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: PluginRouteContext | null;
}): JSX.Element {
  const parent = React.useContext(Context);

  const mergedValue = useMemo(
    () => mergeContexts({parent, value}),
    [parent, value],
  );

  return <Context.Provider value={mergedValue}>{children}</Context.Provider>;
}
