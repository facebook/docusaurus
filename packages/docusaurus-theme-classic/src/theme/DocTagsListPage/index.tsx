/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
import {
  ThemeClassNames,
  translateTagsPageTitle,
} from '@docusaurus/theme-common';
import TagsListByLetter from '@theme/TagsListByLetter';
import type {Props} from '@theme/DocTagsListPage';

function DocTagsListPage({tags}: Props): JSX.Element {
  const title = translateTagsPageTitle();
  return (
    <Layout
      title={title}
      wrapperClassName={ThemeClassNames.wrapper.docsPages}
      pageClassName={ThemeClassNames.page.docsTagsListPage}
      searchMetadatas={{
        // assign unique search tag to exclude this page from search results!
        tag: 'doc_tags_list',
      }}>
      <div className="container margin-vert--lg">
        <div className="row">
          <main className="col col--8 col--offset-2">
            <h1>{title}</h1>
            <TagsListByLetter tags={tags} />
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default DocTagsListPage;
