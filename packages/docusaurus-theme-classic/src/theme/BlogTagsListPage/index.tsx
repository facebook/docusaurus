/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/BlogTagsListPage';
import BlogSidebar from '@theme/BlogSidebar';
import Translate from '@docusaurus/Translate';
import {ThemeClassNames} from '@docusaurus/theme-common';

function getCategoryOfTag(tag: string) {
  // tag's category should be customizable
  return tag[0].toUpperCase();
}

function BlogTagsListPage(props: Props): JSX.Element {
  const {tags, sidebar} = props;

  const tagCategories: {[category: string]: string[]} = {};
  Object.keys(tags).forEach((tag) => {
    const category = getCategoryOfTag(tag);
    tagCategories[category] = tagCategories[category] || [];
    tagCategories[category].push(tag);
  });
  const tagsList = Object.entries(tagCategories).sort(([a], [b]) => {
    if (a === b) {
      return 0;
    }
    return a > b ? 1 : -1;
  });
  const tagsSection = tagsList
    .map(([category, tagsForCategory]) => (
      <div key={category}>
        <h3>{category}</h3>
        {tagsForCategory.map((tag) => (
          <Link
            className="padding-right--md"
            href={tags[tag].permalink}
            key={tag}>
            {tags[tag].name} ({tags[tag].count})
          </Link>
        ))}
        <hr />
      </div>
    ))
    .filter((item) => item != null);

  return (
    <Layout
      title="Tags"
      description="Blog Tags"
      wrapperClassName={ThemeClassNames.wrapper.blogPages}
      pageClassName={ThemeClassNames.page.blogTagsListPage}
      searchMetadatas={{
        // assign unique search tag to exclude this page from search results!
        tag: 'blog_tags_list',
      }}>
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--3">
            <BlogSidebar sidebar={sidebar} />
          </div>
          <main className="col col--7">
            <h1>
              <Translate
                id="theme.tags.tagsPageTitle"
                description="The title of the tag list page">
                Tags
              </Translate>
            </h1>
            <div className="margin-vert--lg">{tagsSection}</div>
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default BlogTagsListPage;
