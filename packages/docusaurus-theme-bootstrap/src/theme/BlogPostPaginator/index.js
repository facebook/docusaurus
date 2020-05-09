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
    <nav aria-label="Blog post page navigation" className="my-5">
      <ul className="pagination justify-content-between">
        <li className="page-item">
          {prevItem && (
            <Link className="page-link rounded-pill" to={prevItem.permalink}>
              &laquo; {prevItem.title}
            </Link>
          )}
        </li>
        <li className="page-item">
          {nextItem && (
            <Link className="page-link rounded-pill" to={nextItem.permalink}>
              {nextItem.title} &raquo;
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default BlogPostPaginator;
