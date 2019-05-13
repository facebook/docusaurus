/**
 * Copyright (c) 2017-present, Facebook, Inc.
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
    <div className="row">
      <div className="col col--6">
        {previousPage && (
          <Link className="button button--secondary" to={previousPage}>
            Newer entries
          </Link>
        )}
      </div>
      <div className="col col--6 text--right">
        {nextPage && (
          <Link className="button button--secondary" to={nextPage}>
            Older entries
          </Link>
        )}
      </div>
    </div>
  );
}

export default BlogListPaginator;
