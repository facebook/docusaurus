/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useMemo} from 'react';
import {useLocation} from '@docusaurus/router';
import {isSamePath} from './routesUtils';
import type {BlogSidebarItem} from '@docusaurus/plugin-content-blog';

function filterUnlistedBlogSidebarItems(
  items: BlogSidebarItem[],
  pathname: string,
): BlogSidebarItem[] {
  return items.filter((item) => {
    if (item.unlisted && !isSamePath(item.permalink, pathname)) {
      return false;
    }
    return true;
  });
}

/**
 * Return the visible blog sidebar items to display.
 * Unlisted items are filtered.
 */
export function useVisibleBlogSidebarItems(
  // TODO put blog sidebar in a React context
  // We should make it accessible to the whole blog layout subtree
  // This hook could have no param
  items: BlogSidebarItem[],
): BlogSidebarItem[] {
  const {pathname} = useLocation();
  return useMemo(
    () => filterUnlistedBlogSidebarItems(items, pathname),
    [items, pathname],
  );
}
