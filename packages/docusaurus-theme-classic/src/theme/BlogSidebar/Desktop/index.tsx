/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useMemo} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {groupBy} from '@docusaurus/theme-common';
import {useVisibleBlogSidebarItems} from '@docusaurus/theme-common/internal';
import type {Props} from '@theme/BlogSidebar/Desktop';
import Heading from '@theme/Heading';
import type {BlogSidebarItem} from '@docusaurus/plugin-content-blog';

import styles from './styles.module.css';

function groupBlogSidebarItemsByYear(
  items: BlogSidebarItem[],
): [string, BlogSidebarItem[]][] {
  const groupedByYear = groupBy(items, (item) => {
    return `${new Date(item.date).getFullYear()}`;
  });
  // "as" is safe here
  // see https://github.com/microsoft/TypeScript/pull/56805#issuecomment-2196526425
  const entries = Object.entries(groupedByYear) as [
    string,
    BlogSidebarItem[],
  ][];
  // We have to use entries because of https://x.com/sebastienlorber/status/1806371668614369486
  // Objects with string/number keys are automatically sorted asc...
  // Even if keys are strings like "2024"
  // We want descending order for years
  entries.reverse();
  return entries;
}

function useItemsByYear(
  items: BlogSidebarItem[],
): [string, BlogSidebarItem[]][] {
  return useMemo(() => groupBlogSidebarItemsByYear(items), [items]);
}

function BlogSidebarItemList({
  year,
  items,
}: {
  year?: string;
  items: BlogSidebarItem[];
}): JSX.Element {
  return (
    <>
      <Heading as="h3">{year}</Heading>
      <ul className={clsx(styles.sidebarItemList, 'clean-list')}>
        {items.map((item) => (
          <li key={item.permalink} className={styles.sidebarItem}>
            <Link
              isNavLink
              to={item.permalink}
              className={styles.sidebarItemLink}
              activeClassName={styles.sidebarItemLinkActive}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function BlogSidebarItemsByYear({items}: {items: BlogSidebarItem[]}) {
  const itemsByYear = useItemsByYear(items);
  return (
    <div>
      {itemsByYear.map(([year, yearItems]) => (
        <BlogSidebarItemList key={year} year={year} items={yearItems} />
      ))}
    </div>
  );
}

function BlogSidebarItems({items}: {items: BlogSidebarItem[]}) {
  const groupByYear = true; // TODO wire appropriate config here
  if (groupByYear) {
    return <BlogSidebarItemsByYear items={items} />;
  } else {
    return <BlogSidebarItemList items={items} />;
  }
}

export default function BlogSidebarDesktop({sidebar}: Props): JSX.Element {
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
