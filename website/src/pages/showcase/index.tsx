/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';

import Layout from '@theme/Layout';
import ShowcaseCheckbox from '@site/src/components/showcase/ShowcaseCheckbox';
import ShowcaseFilterCheckbox from '@site/src/components/showcase/ShowcaseFilterCheckbox';
import ShowcaseCard from '@site/src/components/showcase/ShowcaseCard';
import clsx from 'clsx';

import { useHistory, useLocation } from '@docusaurus/router';

import styles from './styles.module.css';
<<<<<<< HEAD
import { toggleListItem } from '../../utils/jsUtils';
import { SortedUsers, Tags, TagList, User, TagType } from '../../data/users';
=======
import {toggleListItem} from '../../utils/jsUtils';
import {SortedUsers, Tags, TagList, User, TagType} from '../../data/users';
import Tooltip from '../../components/showcase/showcaseTooltip';
import FavoriteIcon from '../../components/svgIcons/FavoriteIcon';
>>>>>>> create Tooltip component, Svg component

const TITLE = 'Docusaurus Site Showcase';
const DESCRIPTION = 'Beautiful sites that people are building with Docusaurus';
const EDIT_URL =
  'https://github.com/facebook/docusaurus/edit/main/website/src/data/users.tsx';

function filterUsers(
  users: User[],
  selectedTags: TagType[],
  operator: boolean,
) {
  if (selectedTags.length === 0) {
    return users;
  }
  return users.filter((user) => {
    if (user.tags.length === 0) {
      return false;
    }
    if (!operator) {
      return selectedTags.every((tag) => user.tags.includes(tag));
    } else {
      return selectedTags.some((tag) => user.tags.includes(tag));
    }
  });
}

function useFilteredUsers(
  users: User[],
  selectedTags: TagType[],
  operator: boolean,
) {
  return useMemo(
    () => filterUsers(users, selectedTags, operator),
    [users, selectedTags, operator],
  );
}

const TagQueryStringKey = 'tags';

function readSearchTags(search: string) {
  return new URLSearchParams(search).getAll(TagQueryStringKey) as TagType[];
}

function replaceSearchTags(search: string, newTags: TagType[]) {
  const searchParams = new URLSearchParams(search);
  searchParams.delete(TagQueryStringKey);
  newTags.forEach((tag) => searchParams.append(TagQueryStringKey, tag));
  return searchParams.toString();
}

function useSelectedTags() {
  // The search query-string is the source of truth!
  const location = useLocation();
  const { push } = useHistory();

  // On SSR / first mount (hydration) no tag is selected
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);

  // Sync tags from QS to state (delayed on purpose to avoid SSR/Client hydration mismatch)
  useEffect(() => {
    const tags = readSearchTags(location.search);
    setSelectedTags(tags);
  }, [location, setSelectedTags]);

  // Update the QS value
  const toggleTag = useCallback(
    (tag: TagType) => {
      const tags = readSearchTags(location.search);
      const newTags = toggleListItem(tags, tag);
      const newSearch = replaceSearchTags(location.search, newTags);
      push({ ...location, search: newSearch });
      // no need to call setSelectedTags, useEffect will do the sync
    },
    [location, push],
  );

  return { selectedTags, toggleTag };
}

function ShowcaseHeader() {
  return (
    <section className="margin-top--lg margin-bottom--xl text--center">
      <h1>{TITLE}</h1>
      <p>{DESCRIPTION}</p>
      <a className={'button button--primary'} href={EDIT_URL} target={'_blank'}>
        🙏 Add your site
      </a>
    </section>
  );
}

interface Props {
  operator: boolean;
  filteredUsers: User[];
  selectedTags: TagType[];
  toggleTag: (tag: TagType) => void;
  setOperator: (op: boolean) => void;
}

function ShowcaseFilters(props: Props) {
  const { operator, filteredUsers, selectedTags, toggleTag, setOperator } = props;

  return (
    <section className="container margin-top--xl margin-bottom--xl">
      <div className={clsx('margin-bottom--sm', styles.filterCheckbox)}>
        <span>
          <h3>Filter</h3>
          <p>{`(${filteredUsers.length} site${filteredUsers.length > 1 ? 's' : ''
            })`}</p>
        </span>
        <ShowcaseFilterCheckbox
          name="operator"
          label="Filter: "
          checked={operator}
          onChange={() => setOperator(!operator)}
        />
      </div>
      <ul className={styles.checkboxList}>
        {TagList.map((tag, i) => {
          const { label, description } = Tags[tag];
          const id = `showcase_checkbox_id_${tag};`;

          return (
            <li key={i} className={styles.checkboxListItem}>
              <Tooltip id={id} text={description} anchorEl="#__docusaurus">
                <ShowcaseCheckbox
                  name={tag}
                  id={id}
                  label={label}
                  title={`${label}: ${description}`}
                  icon={
                    tag === 'favorite' && (
                      <FavoriteIcon svgClass={styles.svgIconFavoriteXs} />
                    )
                  }
                  onChange={() => toggleTag(tag)}
                  checked={selectedTags.includes(tag)}
                />
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ShowcaseCards({
  filteredUsers,
  selectedTags,
}: {
  filteredUsers: User[];
  selectedTags: TagType[];
}) {
  const favoriteUsers =
    selectedTags.length === 0 &&
    SortedUsers.filter((user) => user.tags.includes('favorite'));

  const otherUsers = SortedUsers.filter(
    (user) => !user.tags.includes('favorite'),
  );

  return (
    <section className="margin-top--xl margin-bottom--xl">
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
        <div className={clsx('container padding-vert--md text--center')}>
          <h3>No result</h3>
        </div>
      )}
    </section>
  );
}

function Showcase(): JSX.Element {
  const { selectedTags, toggleTag } = useSelectedTags();
  const [operator, setOperator] = useState(true);
  const filteredUsers = useFilteredUsers(SortedUsers, selectedTags, operator);

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className="margin-vert--lg">
        <ShowcaseHeader />
        <ShowcaseFilters
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          operator={operator}
          filteredUsers={filteredUsers}
          setOperator={setOperator}
        />
        <ShowcaseCards
          filteredUsers={filteredUsers}
          selectedTags={selectedTags}
        />
      </main>
    </Layout>
  );
}

export default Showcase;
