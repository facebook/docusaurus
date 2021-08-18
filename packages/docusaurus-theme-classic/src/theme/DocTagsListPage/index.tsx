/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
import {translate} from '@docusaurus/Translate';
import {ThemeClassNames} from '@docusaurus/theme-common';
import TagsListByLetter from '@theme/TagsListByLetter';

// TODO add TS types later
// import type {Props} from '@theme/DocTagsListPage';
type Props = {
  tags: Record<string, {name: string; permalink: string; count: number}>;
};

function DocTagsListPage({tags}: Props): JSX.Element {
  const title = translate({
    id: 'theme.tags.tagsPageTitle',
    message: 'Tags',
    description: 'The title of the tag list page',
  });
  return (
    <Layout
      title={title}
      wrapperClassName={ThemeClassNames.wrapper.docPages}
      pageClassName={ThemeClassNames.page.docsTagsListPage}
      searchMetadatas={{
        // assign unique search tag to exclude this page from search results!
        tag: 'doc_tags_list',
      }}>
      <div className="container margin-vert--lg">
        <div className="row">
          <main className="col col--8 col--offset-2">
            <h1>{title}</h1>
            <TagsListByLetter tags={Object.values(tags)} />
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default DocTagsListPage;
