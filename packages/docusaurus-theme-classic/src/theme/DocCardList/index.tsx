/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DocCard from '@theme/DocCard';
import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';

export default function DocCardList({
  items,
}: {
  items: PropSidebarItem[];
}): JSX.Element {
  const filteredItems = items.filter((item) => {
    if (item.type === 'category') {
      return item.items.some((child) =>
        ['link', 'category'].includes(child.type),
      );
    }
    return true;
  });

  return (
    <div className="row">
      {filteredItems.map((item, index) => (
        <article key={index} className="col col--6 margin-bottom--lg">
          <DocCard key={index} item={item} />
        </article>
      ))}
    </div>
  );
}
