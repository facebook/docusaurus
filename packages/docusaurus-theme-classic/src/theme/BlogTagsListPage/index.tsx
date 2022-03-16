/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import BlogLayout from '@theme/BlogLayout';
import TagsListByLetter from '@theme/TagsListByLetter';
import type {Props} from '@theme/BlogTagsListPage';
import {
  PageMetadata,
  ThemeClassNames,
  translateTagsPageTitle,
} from '@docusaurus/theme-common';
import SearchMetadata from '../SearchMetadata';

export default function BlogTagsListPage(props: Props): JSX.Element {
  const {tags, sidebar} = props;
  const title = translateTagsPageTitle();
  return (
    <>
      <PageMetadata
        title={title}
        htmlClassNames={[
          ThemeClassNames.wrapper.blogPages,
          ThemeClassNames.page.blogTagsListPage,
        ]}
      />
      <SearchMetadata tag="blog_tags_list" />
      <BlogLayout sidebar={sidebar}>
        <h1>{title}</h1>
        <TagsListByLetter tags={Object.values(tags)} />
      </BlogLayout>
    </>
  );
}
