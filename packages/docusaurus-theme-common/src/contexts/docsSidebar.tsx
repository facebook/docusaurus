/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useContext} from 'react';
import type {PropSidebar} from '@docusaurus/plugin-content-docs';
import {ReactContextError} from '../utils/reactUtils';

// Using a Symbol because null is a valid context value (a doc with no sidebar)
// Inspired by https://github.com/jamiebuilds/unstated-next/blob/master/src/unstated-next.tsx
const EmptyContext: unique symbol = Symbol('EmptyContext');

const Context = React.createContext<PropSidebar | null | typeof EmptyContext>(
  EmptyContext,
);

/**
 * Provide the current sidebar to your children.
 */
export function DocsSidebarProvider({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: PropSidebar | null;
}): JSX.Element {
  return <Context.Provider value={sidebar}>{children}</Context.Provider>;
}

/**
 * Gets the sidebar that's currently displayed, or `null` if there isn't one
 */
export function useDocsSidebar(): PropSidebar | null {
  const sidebar = useContext(Context);
  if (sidebar === EmptyContext) {
    throw new ReactContextError('DocsSidebarProvider');
  }
  return sidebar;
}
