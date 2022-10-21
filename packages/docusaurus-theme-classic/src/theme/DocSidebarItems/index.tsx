/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {memo, useMemo} from 'react';
import {
  DocSidebarItemsExpandedStateProvider,
  isVisibleSidebarItem,
} from '@docusaurus/theme-common/internal';
import DocSidebarItem from '@theme/DocSidebarItem';

import type {Props} from '@theme/DocSidebarItems';

// TODO "technical" component: move it to theme-common later

function useVisibleItems(
  items: Props['items'],
  activePath: string,
): Props['items'] {
  return useMemo(
    () => items.filter((item) => isVisibleSidebarItem(item, activePath)),
    [items, activePath],
  );
}

function DocSidebarItems({items, ...props}: Props): JSX.Element {
  const visibleItems = useVisibleItems(items, props.activePath);
  return (
    <DocSidebarItemsExpandedStateProvider>
      {visibleItems.map((item, index) => (
        <DocSidebarItem key={index} item={item} index={index} {...props} />
      ))}
    </DocSidebarItemsExpandedStateProvider>
  );
}

// Optimize sidebar at each "level"
export default memo(DocSidebarItems);
