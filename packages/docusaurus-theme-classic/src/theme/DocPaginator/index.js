/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';

function DocPaginator(props) {
  const {metadata} = props;

  return (
    <nav className="pagination-nav" aria-label="Blog list page navigation">
      <div className="pagination-nav__item">
        {metadata.previous && (
          <Link
            className="pagination-nav__link"
            to={metadata.previous.permalink}>
            <div className="pagination-nav__sublabel">Previous</div>
            <div className="pagination-nav__label">
              &laquo; {metadata.previous.title}
            </div>
          </Link>
        )}
      </div>
      <div className="pagination-nav__item pagination-nav__item--next">
        {metadata.next && (
          <Link className="pagination-nav__link" to={metadata.next.permalink}>
            <div className="pagination-nav__sublabel">Next</div>
            <div className="pagination-nav__label">
              {metadata.next.title} &raquo;
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default DocPaginator;
