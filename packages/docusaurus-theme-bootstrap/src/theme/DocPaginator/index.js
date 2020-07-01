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
    <nav aria-label="Doc list page navigation" className="my-5 p-0">
      <ul className="pagination justify-content-between">
        <li className="page-item mr-2">
          {previous && (
            <Link className="page-link" to={previous.permalink}>
              &laquo; {previous.title}
            </Link>
          )}
        </li>
        <li className="page-item ml-2">
          {next && (
            <Link className="page-link" to={next.permalink}>
              {next.title} &raquo;
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default DocPaginator;
