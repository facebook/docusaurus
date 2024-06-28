/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {memo} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import {
  useVisibleBlogSidebarItems,
  groupBlogSidebarItemsByYear,
  BlogSidebarItemList,
} from '@docusaurus/theme-common/internal';
import Heading from '@theme/Heading';

import type {Props} from '@theme/BlogSidebar/Desktop';
import type {BlogSidebarItem} from '@docusaurus/plugin-content-blog';

import styles from './styles.module.css';

function BlogSidebarItemListDesktop({
  year,
  items,
}: {
  year?: string;
  items: BlogSidebarItem[];
}) {
  const list = (
    <BlogSidebarItemList
      items={items}
      ulClassName={clsx(styles.sidebarItemList, 'clean-list')}
      liClassName={styles.sidebarItem}
      linkClassName={styles.sidebarItemLink}
      linkActiveClassName={styles.sidebarItemLinkActive}
    />
  );

  if (typeof year === 'undefined') {
    return list;
  }
  return (
    <div role="group">
      <Heading as="h3" className={styles.sidebarItemYearSeparator}>
        {year}
      </Heading>
      {list}
    </div>
  );
}

function BlogSidebarItems({items}: {items: BlogSidebarItem[]}) {
  const groupByYear = true; // TODO wire appropriate config here
  if (groupByYear) {
    const itemsByYear = groupBlogSidebarItemsByYear(items);
    return (
      <>
        {itemsByYear.map(([year, yearItems]) => (
          <BlogSidebarItemListDesktop
            key={year}
            year={year}
            items={yearItems}
          />
        ))}
      </>
    );
  } else {
    return <BlogSidebarItemListDesktop items={items} />;
  }
}

function BlogSidebarDesktop({sidebar}: Props) {
  const items = useVisibleBlogSidebarItems(sidebar.items);
  return (
    <aside className="col col--3">
      <nav
        className={clsx(styles.sidebar, 'thin-scrollbar')}
        aria-label={translate({
          id: 'theme.blog.sidebar.navAriaLabel',
          message: 'Blog recent posts navigation',
          description: 'The ARIA label for recent posts in the blog sidebar',
        })}>
        <div className={clsx(styles.sidebarItemTitle, 'margin-bottom--md')}>
          {sidebar.title}
        </div>
        <BlogSidebarItems items={items} />
      </nav>
    </aside>
  );
}

export default memo(BlogSidebarDesktop);
