/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Sidebars, Order} from './types';
import {collectSidebarDocItems} from './sidebars';

// Build the docs meta such as next, previous, category and sidebar.
export function createOrder(allSidebars: Sidebars): Order {
  const order: Order = {};

  Object.keys(allSidebars).forEach((sidebarId) => {
    const sidebar = allSidebars[sidebarId];

    const docIds: string[] = collectSidebarDocItems(sidebar).map(
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
