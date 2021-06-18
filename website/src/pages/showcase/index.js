/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useMemo, useCallback, useEffect} from 'react';

import Layout from '@theme/Layout';
import ShowcaseCheckbox from '@site/src/components/showcase/ShowcaseCheckbox';
import ShowcaseSelect from '@site/src/components/showcase/ShowcaseSelect';
import ShowcaseCard from '@site/src/components/showcase/ShowcaseCard';
import clsx from 'clsx';

import {useHistory, useLocation} from '@docusaurus/router';

import {toggleListItem} from '../../utils/jsUtils';
import {SortedUsers, Tags, TagList} from '../../data/users';

const TITLE = 'Docusaurus Site Showcase';
const DESCRIPTION = 'List of websites people are building with Docusaurus';
const EDIT_URL =
  'https://github.com/facebook/docusaurus/edit/master/website/src/data/users.js';

function filterUsers(users, selectedTags, operator) {
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

function useFilteredUsers(users, selectedTags, operator) {
  return useMemo(() => filterUsers(users, selectedTags, operator), [
    users,
    selectedTags,
    operator,
  ]);
}

const TagQueryStringKey = 'tags';

function readSearchTags(search) {
  return new URLSearchParams(search).getAll(TagQueryStringKey);
}

function replaceSearchTags(search, newTags) {
  const searchParams = new URLSearchParams(search);
  searchParams.delete(TagQueryStringKey);
  newTags.forEach((tag) => searchParams.append(TagQueryStringKey, tag));
  return searchParams.toString();
}

function useSelectedTags() {
  // The search query-string is the source of truth!
  const location = useLocation();
  const {push} = useHistory();

  // On SSR / first mount (hydration) no tag is selected
  const [selectedTags, setSelectedTags] = useState([]);

  // Sync tags from QS to state (delayed on purpose to avoid SSR/Client hydration mismatch)
  useEffect(() => {
    const tags = readSearchTags(location.search);
    setSelectedTags(tags);
  }, [location, setSelectedTags]);

  // Update the QS value
  const toggleTag = useCallback(
    (tag) => {
      const tags = readSearchTags(location.search);
      const newTags = toggleListItem(tags, tag);
      const newSearch = replaceSearchTags(location.search, newTags);
      push({...location, search: newSearch});
      // no need to call setSelectedTags, useEffect will do the sync
    },
    [location, push],
  );

  return {selectedTags, toggleTag};
}

function ShowcaseHeader() {
  return (
    <div className="text--center">
      <h1>{TITLE}</h1>
      <p>{DESCRIPTION}</p>
      <p>
        <a
          className={'button button--primary'}
          href={EDIT_URL}
          target={'_blank'}>
          🙏 Add your site now!
        </a>
      </p>
    </div>
  );
}

function ShowcaseFilters({selectedTags, toggleTag, operator, setOperator}) {
  return (
    <div className="margin-top--l margin-bottom--md container">
      <div className="row">
        {TagList.map((tag) => {
          const {label, description, icon} = Tags[tag];
          return (
            <div key={tag} className="col col--2">
              <ShowcaseCheckbox
                // TODO add a proper tooltip
                title={`${label}: ${description}`}
                name={tag}
                label={
                  icon ? (
                    <>
                      {icon} {label}
                    </>
                  ) : (
                    label
                  )
                }
                onChange={() => toggleTag(tag)}
                checked={selectedTags.includes(tag)}
              />
            </div>
          );
        })}
        <div className="col col--2">
          <ShowcaseSelect
            name="operator"
            label="Filter: "
            value={operator}
            onChange={(e) => setOperator(e.target.value)}>
            <option value="OR">OR</option>
            <option value="AND">AND</option>
          </ShowcaseSelect>
        </div>
      </div>
    </div>
  );
}

function ShowcaseCards({filteredUsers}) {
  return (
    <section className="container margin-top--lg">
      <h2>
        {filteredUsers.length} site{filteredUsers.length > 1 ? 's' : ''}
      </h2>
      <div className="margin-top--lg">
        {filteredUsers.length > 0 ? (
          <div className="row">
            {filteredUsers.map((user) => (
              <ShowcaseCard
                key={user.title} // Title should be unique
                user={user}
              />
            ))}
          </div>
        ) : (
          <div className={clsx('padding-vert--md text--center')}>
            <h3>No result</h3>
          </div>
        )}
      </div>
    </section>
  );
}

function Showcase() {
  const {selectedTags, toggleTag} = useSelectedTags();
  const [operator, setOperator] = useState('OR');
  const filteredUsers = useFilteredUsers(SortedUsers, selectedTags, operator);
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className="container margin-vert--lg">
        <ShowcaseHeader />
        <ShowcaseFilters
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          operator={operator}
          setOperator={setOperator}
        />
        <ShowcaseCards filteredUsers={filteredUsers} />
      </main>
    </Layout>
  );
}

export default Showcase;
