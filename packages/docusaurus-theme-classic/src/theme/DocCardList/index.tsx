/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';

import DocCard from '@theme/DocCard';
import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';
import {findFirstCategoryLink} from '@docusaurus/theme-common';
import type {Props} from '@theme/DocCardList';

// Filter categories that don't have a link.
function filterItems(items: PropSidebarItem[]): PropSidebarItem[] {
  return items.filter((item) => {
    if (item.type === 'category') {
      return !!findFirstCategoryLink(item);
    }
    return true;
  });
}

export default function DocCardList({items, isGenerated}: Props): JSX.Element {
  const columnSize = 6;
  const columnCount = 12 / columnSize;
  return (
    <div className="row">
      {filterItems(items).map((item, index) => (
        <article
          key={index}
          className={clsx(`col col--${columnSize}`, {
            'margin-bottom--lg': !isGenerated,
            'margin-top--lg': isGenerated && index + 1 > columnCount,
          })}>
          <DocCard key={index} item={item} />
        </article>
      ))}
    </div>
  );
}
