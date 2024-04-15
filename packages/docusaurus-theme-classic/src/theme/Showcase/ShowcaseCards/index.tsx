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
  useFilteredUsers,
  sortUsers,
} from '@docusaurus/plugin-content-showcase/client';
import Heading from '@theme/Heading';
import FavoriteIcon from '@theme/Showcase/FavoriteIcon';
import ShowcaseCard from '@theme/Showcase/ShowcaseCard';
import type {Props} from '@theme/Showcase/ShowcaseCards';
import type {ShowcaseItem} from '@docusaurus/plugin-content-showcase';

import styles from './styles.module.css';

function HeadingNoResult() {
  return (
    <Heading as="h2">
      <Translate id="showcase.usersList.noResult">No result</Translate>
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
      <Translate id="showcase.usersList.allUsers">All sites</Translate>
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
          <ShowcaseCard key={item.title} user={item} />
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

export default function ShowcaseCards(props: Props): JSX.Element {
  const filteredUsers = useFilteredUsers(props.users);

  if (filteredUsers.length === 0) {
    return <NoResultSection />;
  }

  const sortedUsers = sortUsers(props.users);

  const favoriteUsers = sortedUsers.filter((user: ShowcaseItem) =>
    user.tags.includes('favorite'),
  );

  const otherUsers = sortedUsers.filter(
    (user: ShowcaseItem) => !user.tags.includes('favorite'),
  );

  return (
    <section className="margin-top--lg margin-bottom--xl">
      {filteredUsers.length === sortedUsers.length ? (
        <>
          <div className={styles.showcaseFavorite}>
            <CardList heading={<HeadingFavorites />} items={favoriteUsers} />
          </div>
          <div className="margin-top--lg">
            <CardList heading={<HeadingAllSites />} items={otherUsers} />
          </div>
        </>
      ) : (
        <CardList items={filteredUsers} />
      )}
    </section>
  );
}
