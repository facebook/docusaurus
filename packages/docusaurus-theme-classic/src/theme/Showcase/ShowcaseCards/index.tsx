/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactNode} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {
  useFilteredItems,
  sortItems,
  useShowcaseItems,
} from '@docusaurus/plugin-content-showcase/client';
import Heading from '@theme/Heading';
import FavoriteIcon from '@theme/Showcase/FavoriteIcon';
import ShowcaseCard from '@theme/Showcase/ShowcaseCard';
import type {ShowcaseItem} from '@docusaurus/plugin-content-showcase';
import styles from './styles.module.css';

function HeadingNoResult() {
  return (
    <Heading as="h2">
      <Translate id="showcase.itemsList.noResult">No result</Translate>
    </Heading>
  );
}

function HeadingFavorites() {
  return (
    <Heading as="h2" className={styles.headingFavorites}>
      <Translate id="showcase.favoritesList.title">Our favorites</Translate>
      <FavoriteIcon size="large" style={{marginLeft: '1rem'}} />
    </Heading>
  );
}

function HeadingAllSites() {
  return (
    <Heading as="h2">
      <Translate id="showcase.itemsList.allItems">All sites</Translate>
    </Heading>
  );
}

function CardList({
  heading,
  items,
}: {
  heading?: ReactNode;
  items: ShowcaseItem[];
}) {
  return (
    <div className="container">
      {heading}
      <ul className={clsx('clean-list', styles.cardList)}>
        {items.map((item) => (
          <ShowcaseCard key={item.title} item={item} />
        ))}
      </ul>
    </div>
  );
}

function NoResultSection() {
  return (
    <section className="margin-top--lg margin-bottom--xl">
      <div className="container padding-vert--md text--center">
        <HeadingNoResult />
      </div>
    </section>
  );
}

export default function ShowcaseCards(): JSX.Element {
  const items = useShowcaseItems();

  const filteredItems = useFilteredItems(items);

  if (filteredItems.length === 0) {
    return <NoResultSection />;
  }

  const sortedItems = sortItems(items);

  const favoriteItems = sortedItems.filter((item: ShowcaseItem) =>
    item.tags.includes('favorite'),
  );

  const otherItems = sortedItems.filter(
    (item: ShowcaseItem) => !item.tags.includes('favorite'),
  );

  return (
    <section className="margin-top--lg margin-bottom--xl">
      {filteredItems.length === sortedItems.length ? (
        <>
          <div className={styles.showcaseFavorite}>
            <CardList heading={<HeadingFavorites />} items={favoriteItems} />
          </div>
          <div className="margin-top--lg">
            <CardList heading={<HeadingAllSites />} items={otherItems} />
          </div>
        </>
      ) : (
        <CardList items={filteredItems} />
      )}
    </section>
  );
}
