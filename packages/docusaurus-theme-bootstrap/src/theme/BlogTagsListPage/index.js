/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Link from '@docusaurus/Link';

function BlogTagsListPage(props) {
  const {tags} = props;
  const renderAllTags = () => (
    <>
      {Object.keys(tags).map((tag) => (
        <Link
          href={tags[tag].permalink}
          key={tag}
          className="btn btn-primary m-2">
          {tags[tag].name}{' '}
          <span className="badge badge-light">{tags[tag].count}</span>
        </Link>
      ))}
    </>
  );

  return (
    <div className="container my-3 justify-content-center">
      <h1 className="text-primary">Tags</h1>
      <ul className="my-xl-4">{renderAllTags()}</ul>
    </div>
  );
}

export default BlogTagsListPage;
