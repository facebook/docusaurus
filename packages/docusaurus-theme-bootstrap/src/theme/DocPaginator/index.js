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
    <nav className="pagination-nav">
      <div className="pagination-nav__item">
        {metadata.previous && (
          <Link
            className="pagination-nav__link"
            to={metadata.previous.permalink}>
            <div className="pagination-nav__link--sublabel">Previous</div>
            <div className="pagination-nav__link--label">
              &laquo; {metadata.previous.title}
            </div>
          </Link>
        )}
      </div>
      <div className="pagination-nav__item pagination-nav__item--next">
        {metadata.next && (
          <Link className="pagination-nav__link" to={metadata.next.permalink}>
            <div className="pagination-nav__link--sublabel">Next</div>
            <div className="pagination-nav__link--label">
              {metadata.next.title} &raquo;
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default DocPaginator;
