/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Sidebar, SidebarItem, Order} from './types';

// Build the docs meta such as next, previous, category and sidebar.
export default function createOrder(allSidebars: Sidebar = {}): Order {
  const order: Order = {};

  Object.keys(allSidebars).forEach((sidebarId) => {
    const sidebar = allSidebars[sidebarId];

    const ids: string[] = [];
    const indexItems = ({items}: {items: SidebarItem[]}) => {
      items.forEach((item) => {
        switch (item.type) {
          case 'category':
            indexItems({
              items: item.items,
            });
            break;
          case 'ref':
          case 'link':
            // Refs and links should not be shown in navigation.
            break;
          case 'doc':
            ids.push(item.id);
            break;
          default:
            break;
        }
      });
    };

    indexItems({items: sidebar});

    // eslint-disable-next-line
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let previous;
      let next;

      if (i > 0) {
        previous = ids[i - 1];
      }

      if (i < ids.length - 1) {
        next = ids[i + 1];
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
