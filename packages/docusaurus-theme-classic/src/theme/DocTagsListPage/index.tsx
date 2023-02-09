/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  translateTagsPageTitle,
} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import TagsListByLetter from '@theme/TagsListByLetter';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/DocTagsListPage';

export default function DocTagsListPage({tags}: Props): JSX.Element {
  const title = translateTagsPageTitle();
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.docsPages,
        ThemeClassNames.page.docsTagsListPage,
      )}>
      <PageMetadata title={title} />
      <SearchMetadata tag="doc_tags_list" />
      <Layout>
        <div className="container margin-vert--lg">
          <div className="row">
            <main className="col col--8 col--offset-2">
              <h1>{title}</h1>
              <TagsListByLetter tags={tags} />
            </main>
          </div>
        </div>
      </Layout>
    </HtmlClassNameProvider>
  );
}
