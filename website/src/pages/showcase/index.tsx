/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect} from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import {useHistory, useLocation} from '@docusaurus/router';

import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import ShowcaseCards from './_components/ShowcaseCards';
import ShowcaseFilters from './_components/ShowcaseFilters';
import {prepareUserState, readSearchName, setSearchName} from './_utils';

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
