/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/BlogListPaginator';

function BlogListPaginator(props: Props): JSX.Element {
  const {metadata} = props;
  const {previousPage, nextPage} = metadata;

  return (
    <nav
      className="pagination-nav"
      aria-label={translate({
        id: 'theme.blog.paginator.navAriaLabel',
        message: 'Blog list page navigation',
        description: 'The ARIA label for the blog pagination',
      })}>
      <div className="pagination-nav__item">
        {previousPage && (
          <Link className="pagination-nav__link" to={previousPage}>
            <div className="pagination-nav__label">
              &laquo;{' '}
              <Translate
                id="theme.blog.paginator.newerEntries"
                description="The label used to navigate to the newer blog posts page (previous page)">
                Newer Entries
              </Translate>
            </div>
          </Link>
        )}
      </div>
      <div className="pagination-nav__item pagination-nav__item--next">
        {nextPage && (
          <Link className="pagination-nav__link" to={nextPage}>
            <div className="pagination-nav__label">
              <Translate
                id="theme.blog.paginator.olderEntries"
                description="The label used to navigate to the older blog posts page (next page)">
                Older Entries
              </Translate>{' '}
              &raquo;
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default BlogListPaginator;
