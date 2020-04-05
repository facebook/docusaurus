/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';

function BlogPostPaginator(props) {
  const {nextItem, prevItem} = props;

  return (
    <nav className="pagination pagination-lg justify-content-between">
      <div className="page-item">
        {prevItem && (
          <Link className="page-link" to={prevItem.permalink}>
            <small>Previous Post<br/></small>
            <span>&laquo; {prevItem.title}</span>
          </Link>
        )}
      </div>
      <div className="page-item">
        {nextItem && (
          <Link className="page-link" to={nextItem.permalink}>
            <small>Next Post<br/></small>
            <span>{nextItem.title} &raquo;</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default BlogPostPaginator;
