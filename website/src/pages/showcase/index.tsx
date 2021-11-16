/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useMemo, useEffect} from 'react';

import Layout from '@theme/Layout';
import clsx from 'clsx';

import FavoriteIcon from '@site/src/components/svgIcons/FavoriteIcon';
import ShowcaseTagSelect, {
  readSearchTags,
} from '@site/src/components/showcase/ShowcaseTagSelect';
import ShowcaseFilterToggle, {
  Operator,
  readOperator,
} from '@site/src/components/showcase/ShowcaseFilterToggle';
import ShowcaseCard from '@site/src/components/showcase/ShowcaseCard';
import {sortedUsers, Tags, TagList, User, TagType} from '@site/src/data/users';
import Tooltip from '@site/src/components/showcase/ShowcaseTooltip';

import {useLocation} from '@docusaurus/router';

import styles from './styles.module.css';

const TITLE = 'Docusaurus Site Showcase';
const DESCRIPTION = 'List of websites people are building with Docusaurus';
const EDIT_URL =
  'https://github.com/facebook/docusaurus/edit/main/website/src/data/users.tsx';

function filterUsers(
  users: User[],
  selectedTags: TagType[],
  operator: Operator,
) {
  if (selectedTags.length === 0) {
    return users;
  }
  return users.filter((user) => {
    if (user.tags.length === 0) {
      return false;
    }
    if (operator === 'AND') {
      return selectedTags.every((tag) => user.tags.includes(tag));
    } else {
      return selectedTags.some((tag) => user.tags.includes(tag));
    }
  });
}

function useFilteredUsers() {
  const selectedTags = useSelectedTags();
  const location = useLocation();
  const [operator, setOperator] = useState<Operator>('OR');
  useEffect(() => {
    setOperator(readOperator(location.search));
  }, [location]);
  return useMemo(
    () => filterUsers(sortedUsers, selectedTags, operator),
    [selectedTags, operator],
  );
}

function useSelectedTags() {
  // The search query-string is the source of truth!
  const location = useLocation();

  // On SSR / first mount (hydration) no tag is selected
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);

  // Sync tags from QS to state (delayed on purpose to avoid SSR/Client hydration mismatch)
  useEffect(() => {
    const tags = readSearchTags(location.search);
    setSelectedTags(tags);
  }, [location]);

  return selectedTags;
}

function ShowcaseHeader() {
  return (
    <section className="margin-top--lg margin-bottom--xl text--center">
      <h1>{TITLE}</h1>
      <p>{DESCRIPTION}</p>
      <a
        className={clsx('button button--primary', styles.showcaseCardSrcBtn)}
        href={EDIT_URL}
        target="_blank"
        rel="noreferrer">
        🙏 Add your site
      </a>
    </section>
  );
}

function ShowcaseFilters() {
  const filteredUsers = useFilteredUsers();
  return (
    <section className="container margin-top--xl margin-bottom--lg">
      <div className={clsx('margin-bottom--sm', styles.filterCheckbox)}>
        <span>
          <h3>Filter</h3>
          <p>{`(${filteredUsers.length} site${
            filteredUsers.length > 1 ? 's' : ''
          })`}</p>
        </span>
        <ShowcaseFilterToggle />
      </div>
      <ul className={styles.checkboxList}>
        {TagList.map((tag, i) => {
          const {label, description, color} = Tags[tag];
          const id = `showcase_checkbox_id_${tag};`;

          return (
            <li key={i} className={styles.checkboxListItem}>
              <Tooltip id={id} text={description} anchorEl="#__docusaurus">
                <ShowcaseTagSelect
                  tag={tag}
                  id={id}
                  label={label}
                  icon={
                    tag === 'favorite' ? (
                      <FavoriteIcon svgClass={styles.svgIconFavoriteXs} />
                    ) : (
                      <span
                        style={{
                          backgroundColor: color,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          marginLeft: 8,
                        }}
                      />
                    )
                  }
                />
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ShowcaseCards() {
  const selectedTags = useSelectedTags();
  const filteredUsers = useFilteredUsers();
  const favoriteUsers =
    selectedTags.length === 0 &&
    sortedUsers.filter((user) => user.tags.includes('favorite'));

  const otherUsers = sortedUsers.filter(
    (user) => !user.tags.includes('favorite'),
  );

  return (
    <section className="margin-top--lg margin-bottom--xl">
      {filteredUsers.length > 0 ? (
        <>
          {favoriteUsers ? (
            <>
              <div className={styles.showcaseFavorite}>
                <div className="container">
                  <div
                    className={clsx(
                      'margin-bottom--md',
                      styles.showcaseFavoriteHeader,
                    )}>
                    <h3>Our favorites</h3>
                    <FavoriteIcon svgClass={styles.svgIconFavorite} />
                  </div>
                  <ul className={clsx('container', styles.showcaseList)}>
                    {favoriteUsers.map((user) => (
                      <ShowcaseCard
                        key={user.title} // Title should be unique
                        user={user}
                      />
                    ))}
                  </ul>
                </div>
              </div>
              <div className="container margin-top--xl">
                <h3 className={styles.showcaseHeader}>All sites</h3>
                <ul className={styles.showcaseList}>
                  {otherUsers.map((user) => (
                    <ShowcaseCard
                      key={user.title} // Title should be unique
                      user={user}
                    />
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="container">
              <ul className={styles.showcaseList}>
                {filteredUsers.map((user) => (
                  <ShowcaseCard
                    key={user.title} // Title should be unique
                    user={user}
                  />
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="container padding-vert--md text--center">
          <h3>No result</h3>
        </div>
      )}
    </section>
  );
}

function Showcase(): JSX.Element {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className="margin-vert--lg">
        <ShowcaseHeader />
        <ShowcaseFilters />
        <ShowcaseCards />
      </main>
    </Layout>
  );
}

export default Showcase;
