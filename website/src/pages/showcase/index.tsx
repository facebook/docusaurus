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
import { toggleListItem } from '../../utils/jsUtils';
import { SortedUsers, Tags, TagList, User, TagType } from '../../data/users';

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
    <section className="margin-top--xl margin-bottom--xl">
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
        {TagList.map((tag) => {
          const { label, description } = Tags[tag];

          return (
            <ShowcaseCheckbox
              // TODO add a proper tooltip
              name={tag}
              key={tag}
              label={label}
              title={`${label}: ${description}`}
              onChange={() => toggleTag(tag)}
              checked={selectedTags.includes(tag)}
            />
          );
        })}
      </ul>
    </section>
  );
}

function ShowcaseCards({ filteredUsers }: { filteredUsers: User[] }) {
  return (
    <section className="margin-top--xl margin-bottom--xl">
      <div className={clsx('margin-top--lg', styles.showcaseList)}>
        {filteredUsers.length > 0 ? (
          <ul className={clsx(styles.showcaseGrid)}>
            {filteredUsers.map((user) => (
              <ShowcaseCard
                key={user.title} // Title should be unique
                user={user}
              />
            ))}
          </ul>
        ) : (
          <div className={clsx('padding-vert--md text--center')}>
            <h3>No result</h3>
          </div>
        )}
      </div>
    </section>
  );
}

function Showcase(): JSX.Element {
  const { selectedTags, toggleTag } = useSelectedTags();
  const [operator, setOperator] = useState(true);
  const filteredUsers = useFilteredUsers(SortedUsers, selectedTags, operator);

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className="container margin-vert--lg">
        <ShowcaseHeader />
        <ShowcaseFilters
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          operator={operator}
          filteredUsers={filteredUsers}
          setOperator={setOperator}
        />
        <ShowcaseCards filteredUsers={filteredUsers} />
      </main>
    </Layout>
  );
}

export default Showcase;
