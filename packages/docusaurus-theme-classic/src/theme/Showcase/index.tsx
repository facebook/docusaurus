/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Translate, {translate} from '@docusaurus/Translate';

import Link from '@docusaurus/Link';
import {clientShowcase} from '@docusaurus/plugin-content-showcase/client';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import ShowcaseSearchBar from '@theme/Showcase/ShowcaseSearchBar';
import ShowcaseCards from '@theme/Showcase/ShowcaseCards';
import ShowcaseFilters from '@theme/Showcase/ShowcaseFilters';
import type {Props} from '@theme/Showcase';

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

export default function Showcase(props: Props): JSX.Element {
  const users = props.content;
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      {/* eslint-disable-next-line @docusaurus/prefer-docusaurus-heading, @docusaurus/no-untranslated-text */}
      <h1>Client showcase API: {clientShowcase}</h1>
      <main className="margin-vert--lg">
        <ShowcaseHeader />
        <ShowcaseFilters users={users} />
        <div
          style={{display: 'flex', marginLeft: 'auto'}}
          className="container">
          <ShowcaseSearchBar />
        </div>
        <ShowcaseCards users={users} />
      </main>
    </Layout>
  );
}
