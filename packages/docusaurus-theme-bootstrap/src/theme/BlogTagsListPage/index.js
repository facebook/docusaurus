/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

function BlogTagsListPage(props) {
  const {tags} = props;
  const renderAllTags = () => (
    <>
      {Object.keys(tags).map((tag) => (
        <Link
          href={tags[tag].permalink}
          key={tag}
          className="btn btn-primary list-inline-item my-2">
          {tags[tag].name}{' '}
          <span className="badge badge-light">{tags[tag].count}</span>
        </Link>
      ))}
    </>
  );

  return (
    <Layout title="Tags" description="Blog Tags">
      <div className="container my-3 justify-content-center">
        <h1 className="text-primary">Tags</h1>
        <ul className="my-xl-4 list-inline">{renderAllTags()}</ul>
      </div>
    </Layout>
  );
}

export default BlogTagsListPage;
