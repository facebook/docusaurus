/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';

function BlogListPaginator(props) {
  const {metadata} = props;
  const {previousPage, nextPage} = metadata;

  return (
    <nav className="pagination pagination-lg justify-content-between">
      <div className="page-item">
        {previousPage && (
          <Link className="page-link" to={previousPage}>
            <span>
              &laquo; Newer Entries
            </span>
          </Link>
        )}
      </div>
      <div className="page-item">
        {nextPage && (
          <Link className="page-link" to={nextPage}>
            <span>
              Older Entries &raquo;
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default BlogListPaginator;
