/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';

function BlogPostPaginator(props) {
  const {nextItem, prevItem} = props;

  return (
    <div className="row">
      <div className="col col--6">
        {prevItem && (
          <Link className="button button--secondary" to={prevItem.permalink}>
            {prevItem.title}
          </Link>
        )}
      </div>
      <div className="col col--6 text--right">
        {nextItem && (
          <Link className="button button--secondary" to={nextItem.permalink}>
            {nextItem.title}
          </Link>
        )}
      </div>
    </div>
  );
}

export default BlogPostPaginator;
