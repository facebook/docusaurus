/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import type {Metadata} from '@theme/BlogListPage';

function BlogListPaginator(props: {readonly metadata: Metadata}): JSX.Element {
  const {metadata} = props;
  const {previousPage, nextPage} = metadata;

  return (
    <nav className="pagination-nav" aria-label="Blog list page navigation">
      <div className="pagination-nav__item">
        {previousPage && (
          <Link className="pagination-nav__link" to={previousPage}>
            <h4 className="pagination-nav__label">&laquo; Newer Entries</h4>
          </Link>
        )}
      </div>
      <div className="pagination-nav__item pagination-nav__item--next">
        {nextPage && (
          <Link className="pagination-nav__link" to={nextPage}>
            <h4 className="pagination-nav__label">Older Entries &raquo;</h4>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default BlogListPaginator;
