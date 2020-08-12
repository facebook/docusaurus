/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Sidebars, SidebarItem, Order, SidebarItemDoc} from './types';
import {flatten} from 'lodash';

function getOrderedDocItems(items: SidebarItem[]): SidebarItemDoc[] {
  function getDocItemsRecursion(item: SidebarItem): SidebarItemDoc[] {
    if (item.type === 'doc') {
      return [item];
    }
    if (item.type === 'category') {
      return getOrderedDocItems(item.items);
    }
    // Refs and links should not be shown in navigation.
    if (item.type === 'ref' || item.type === 'link') {
      return [];
    }
    throw new Error(`unknown sidebar item type = ${item.type}`);
  }

  return flatten(items.map(getDocItemsRecursion));
}

// Build the docs meta such as next, previous, category and sidebar.
export function createOrder(allSidebars: Sidebars = {}): Order {
  const order: Order = {};

  Object.keys(allSidebars).forEach((sidebarId) => {
    const sidebar = allSidebars[sidebarId];

    const docIds: string[] = getOrderedDocItems(sidebar).map(
      (docItem) => docItem.id,
    );

    // eslint-disable-next-line
    for (let i = 0; i < docIds.length; i++) {
      const id = docIds[i];
      let previous;
      let next;

      if (i > 0) {
        previous = docIds[i - 1];
      }

      if (i < docIds.length - 1) {
        next = docIds[i + 1];
      }

      order[id] = {
        previous,
        next,
        sidebar: sidebarId,
      };
    }
  });

  return order;
}
