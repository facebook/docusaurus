/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import type {Props} from '@theme/DocCategoryGeneratedIndex';
import {useDocsSidebar} from '@docusaurus/theme-common';
import {
  PropSidebarItem,
  PropSidebarItemCategory,
} from '@docusaurus/plugin-content-docs/lib/sidebars/types';
import Link from '@docusaurus/Link';
import {PropSidebarItemLink} from '@docusaurus/plugin-content-docs-types';

// Use the components props and the sidebar in context
// to get back the related sidebar category that we want to render
function useSidebarCategory(categoryIndex: Props['categoryIndex']) {
  const sidebar = useDocsSidebar();
  if (!sidebar) {
    throw new Error(
      `unexpected: a category index should have a sidebar: ${JSON.stringify(
        categoryIndex,
      )}`,
    );
  }

  // TODO more performant algo returning single element
  function collectCategoriesMatch(
    items: PropSidebarItem[],
  ): PropSidebarItemCategory[] {
    return items.flatMap((item) => {
      if (item.type === 'category') {
        if (item.href === categoryIndex.permalink) {
          return [item];
        }
        return collectCategoriesMatch(item.items);
      }
      return [];
    });
  }

  const [sidebarCategory] = collectCategoriesMatch(sidebar);

  if (!sidebarCategory) {
    throw new Error(
      `Unexpected: sidebar category could not be found for categoryIndex=${JSON.stringify(
        categoryIndex,
      )}`,
    );
  }

  return sidebarCategory;
}

function SidebarItemCategory({
  item,
}: {
  item: PropSidebarItemCategory;
}): JSX.Element {
  const label = item.href ? (
    <Link href={item.href}>{item.label}</Link>
  ) : (
    <span style={{cursor: 'not-allowed'}}>{item.label}</span>
  );

  return (
    <div>
      <div>
        {'=> '} {label}
      </div>
      <div>
        <SidebarItemsList items={item.items} />
      </div>
    </div>
  );
}

function SidebarItemLink({item}: {item: PropSidebarItemLink}): JSX.Element {
  return <Link href={item.href}>{item.label}</Link>;
}

function SidebarItem({item}: {item: PropSidebarItem}): JSX.Element {
  switch (item.type) {
    case 'link':
      return <SidebarItemLink item={item} />;
    case 'category':
      return <SidebarItemCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}

function SidebarItemsList({items}: {items: PropSidebarItem[]}): JSX.Element {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <SidebarItem item={item} />
        </li>
      ))}
    </ul>
  );
}

export default function DocCategoryGeneratedIndex(props: Props): JSX.Element {
  const {categoryIndex} = props;
  const category = useSidebarCategory(categoryIndex);
  return (
    <>
      <h1>{category.label}</h1>
      <div>
        <SidebarItemsList items={category.items} />
      </div>
    </>
  );
}
