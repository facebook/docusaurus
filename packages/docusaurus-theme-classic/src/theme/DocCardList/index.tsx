/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DocCard from '@theme/DocCard';
import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';
import {findFirstCategoryLink} from '@docusaurus/theme-common';

// Filter categories that don't have a link.
function filterItems(items: PropSidebarItem[]): PropSidebarItem[] {
  return items.filter((item) => {
    if (item.type === 'category') {
      return !!findFirstCategoryLink(item);
    }
    return true;
  });
}

export default function DocCardList({
  items,
}: {
  items: PropSidebarItem[];
}): JSX.Element {
  return (
    <div className="row">
      {filterItems(items).map((item, index) => (
        <article key={index} className="col col--6 margin-bottom--lg">
          <DocCard key={index} item={item} />
        </article>
      ))}
    </div>
  );
}
