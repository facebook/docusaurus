/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect} from 'react';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import {useHistory, useLocation} from '@docusaurus/router';

import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import FavoriteIcon from '@site/src/pages/showcase/_components/FavoriteIcon';
import {Tags, TagList} from '@site/src/data/users';
import Heading from '@theme/Heading';
import ShowcaseTagSelect from './_components/ShowcaseTagSelect';
import OperatorButton from './_components/OperatorButton';
import ClearAllButton from './_components/ClearAllButton';

import ShowcaseCards from './_components/ShowcaseCards';
import ShowcaseTooltip from './_components/ShowcaseTooltip';

import {
  prepareUserState,
  readSearchName,
  setSearchName,
  useFilteredUsers,
  useSiteCountPlural,
} from './_utils';

import styles from './styles.module.css';

const TITLE = translate({message: 'Docusaurus Site Showcase'});
const DESCRIPTION = translate({
  message: 'List of websites people are building with Docusaurus',
});
const SUBMIT_URL = 'https://github.com/facebook/docusaurus/discussions/7826';

function ShowcaseHeader() {
  return (
    <section className="margin-top--lg margin-bottom--lg text--center">
      <Heading as="h1">{TITLE}</Heading>
      <p>{DESCRIPTION}</p>
      <Link className="button button--primary" to={SUBMIT_URL}>
        <Translate id="showcase.header.button">
          🙏 Please add your site
        </Translate>
      </Link>
    </section>
  );
}

function ShowcaseFilters() {
  const filteredUsers = useFilteredUsers();
  const siteCountPlural = useSiteCountPlural();
  return (
    <section className="container margin-top--l margin-bottom--lg">
      <div className={clsx('margin-bottom--sm', styles.filterCheckbox)}>
        <div>
          <Heading as="h2">
            <Translate id="showcase.filters.title">Filters</Translate>
          </Heading>
          <span>{siteCountPlural(filteredUsers.length)}</span>
        </div>
        <div className="row" style={{alignItems: 'center'}}>
          <OperatorButton />
          <ClearAllButton />
        </div>
      </div>
      <ul className={clsx('clean-list', styles.checkboxList)}>
        {TagList.map((tag, i) => {
          const {label, description, color} = Tags[tag];
          const id = `showcase_checkbox_id_${tag}`;
          return (
            <li key={i} className={styles.checkboxListItem}>
              <ShowcaseTooltip
                id={id}
                text={description}
                anchorEl="#__docusaurus">
                <ShowcaseTagSelect
                  tag={tag}
                  id={id}
                  label={label}
                  icon={
                    tag === 'favorite' ? (
                      <FavoriteIcon
                        size="small"
                        style={{marginLeft: '0.625rem'}}
                      />
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
              </ShowcaseTooltip>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SearchBar() {
  const history = useHistory();
  const location = useLocation();
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    setValue(readSearchName(location.search));
  }, [location]);
  return (
    <div className={styles.searchContainer}>
      <input
        id="searchbar"
        placeholder={translate({
          message: 'Search for site name...',
          id: 'showcase.searchBar.placeholder',
        })}
        value={value ?? undefined}
        onInput={(e) => {
          const name = e.currentTarget.value;
          setValue(name);
          const newSearch = setSearchName(location.search, name);
          history.push({
            ...location,
            search: newSearch,
            state: prepareUserState(),
          });

          // TODO ???
          setTimeout(() => {
            document.getElementById('searchbar')?.focus();
          }, 0);
        }}
      />
    </div>
  );
}

export default function Showcase(): JSX.Element {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className="margin-vert--lg">
        <ShowcaseHeader />
        <ShowcaseFilters />
        <div
          style={{display: 'flex', marginLeft: 'auto'}}
          className="container">
          <SearchBar />
        </div>
        <ShowcaseCards />
      </main>
    </Layout>
  );
}
