/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/BlogPostPaginator';

function BlogPostPaginator(props: Props): JSX.Element {
  const {nextItem, prevItem} = props;

  return (
    <nav className="pagination-nav" aria-label="Blog post page navigation">
      <div className="pagination-nav__item">
        {prevItem && (
          <Link className="pagination-nav__link" to={prevItem.permalink}>
            <div className="pagination-nav__sublabel">
              <Translate
                id="theme.BlogPostPaginator.newerPost"
                description="The blog post button label to navigate to the newer/previous post">
                Newer Post
              </Translate>
            </div>
            <div className="pagination-nav__label">
              &laquo; {prevItem.title}
            </div>
          </Link>
        )}
      </div>
      <div className="pagination-nav__item pagination-nav__item--next">
        {nextItem && (
          <Link className="pagination-nav__link" to={nextItem.permalink}>
            <div className="pagination-nav__sublabel">
              <Translate
                id="theme.BlogPostPaginator.olderPost"
                description="The blog post button label to navigate to the older/next post">
                Older Post
              </Translate>
            </div>
            <div className="pagination-nav__label">
              {nextItem.title} &raquo;
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default BlogPostPaginator;
