/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';

function DocPaginator(props) {
  const {previous, next} = props.metadata;

  return (
    <nav
      aria-label="Blog list page navigation"
      className="my-5 col col-xl-4 offset-xl-4 col-xs-6">
      <ul className="pagination justify-content-between">
        <li className="page-item">
          {previous && (
            <Link className="page-link rounded-pill" to={previous.permalink}>
              &laquo; {previous.title}
            </Link>
          )}
        </li>
        <li className="page-item">
          {next && (
            <Link className="page-link rounded-pill" to={next.permalink}>
              {next.title} &raquo;
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default DocPaginator;
