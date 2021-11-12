/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode} from 'react';

import type {Props} from '@theme/DocCategoryGeneratedIndex';
import {useDocsSidebar} from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import {
  PropSidebarItem,
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from '@docusaurus/plugin-content-docs';
import clsx from 'clsx';
import styles from './styles.module.css';
import isInternalUrl from '@docusaurus/isInternalUrl';

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

function Card({
  icon,
  href,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  href?: string;
}): JSX.Element {
  const className = clsx('card margin--md padding--md', styles.card);

  const content = (
    <div>
      <h2>
        {icon} {title}
      </h2>
      <div>{description}</div>
    </div>
  );

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

function CardCategory({item}: {item: PropSidebarItemCategory}): JSX.Element {
  return (
    <Card
      icon="🗄️"
      title={item.label}
      description={`${item.items.length} items`}
      href={item.href}
    />
  );
}

function CardLink({item}: {item: PropSidebarItemLink}): JSX.Element {
  const icon = isInternalUrl(item.href) ? '📄️' : '🔗';
  return <Card icon={icon} title={item.label} href={item.href} />;
}

function CardListItem({item}: {item: PropSidebarItem}): JSX.Element {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}

function CardList({items}: {items: PropSidebarItem[]}): JSX.Element {
  return (
    <ul className={clsx('row', styles.cardList)}>
      {items.map((item, index) => (
        <li key={index} className="col col--4">
          <CardListItem item={item} />
        </li>
      ))}
    </ul>
  );
}

export default function DocCategoryGeneratedIndex(props: Props): JSX.Element {
  const {categoryIndex} = props;
  const category = useSidebarCategory(categoryIndex);
  return (
    <div className={styles.page}>
      <header>
        <h1>{category.label}</h1>
      </header>
      <main className="container margin-top--lg">
        <CardList items={category.items} />
      </main>
    </div>
  );
}
