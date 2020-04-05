/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

function getCategoryOfTag(tag) {
  // tag's category should be customizable
  return tag[0].toUpperCase();
}

function BlogTagsListPage(props) {
  const {tags} = props;

  const tagCategories = {};
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
    <Layout title="Tags" description="Blog Tags">
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Tags</h1>
            <div className="margin-vert--lg">{tagsSection}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BlogTagsListPage;
