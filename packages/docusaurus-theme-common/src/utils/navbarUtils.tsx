/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import {NavbarMobileSidebarProvider} from '../contexts/navbarMobileSidebar';
import {NavbarSecondaryMenuProvider} from '../contexts/navbarSecondaryMenu';

const DefaultNavItemPosition = 'right';

/**
 * Split links by left/right. If position is unspecified, fallback to right.
 */
export function splitNavbarItems<T extends {position?: 'left' | 'right'}>(
  items: T[],
): [leftItems: T[], rightItems: T[]] {
  function isLeft(item: T): boolean {
    return (item.position ?? DefaultNavItemPosition) === 'left';
  }

  const leftItems = items.filter(isLeft);
  const rightItems = items.filter((item) => !isLeft(item));

  return [leftItems, rightItems];
}

/**
 * Composes the `NavbarMobileSidebarProvider` and `NavbarSecondaryMenuProvider`.
 * Because the latter depends on the former, they can't be re-ordered.
 */
export function NavbarProvider({children}: {children: ReactNode}): JSX.Element {
  return (
    <NavbarMobileSidebarProvider>
      <NavbarSecondaryMenuProvider>{children}</NavbarSecondaryMenuProvider>
    </NavbarMobileSidebarProvider>
  );
}
