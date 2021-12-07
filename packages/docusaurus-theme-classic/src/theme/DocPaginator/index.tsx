/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import type {PropNavigation} from '@docusaurus/plugin-content-docs';

function DocPaginator(props: PropNavigation): JSX.Element {
  const {previous, next} = props;

  return (
    <nav
      className="pagination-nav docusaurus-mt-lg"
      aria-label={translate({
        id: 'theme.docs.paginator.navAriaLabel',
        message: 'Docs pages navigation',
        description: 'The ARIA label for the docs pagination',
      })}>
      <div className="pagination-nav__item">
        {previous && (
          <Link className="pagination-nav__link" to={previous.permalink}>
            <div className="pagination-nav__sublabel">
              <Translate
                id="theme.docs.paginator.previous"
                description="The label used to navigate to the previous doc">
                Previous
              </Translate>
            </div>
            <div className="pagination-nav__label">
              &laquo; {previous.title}
            </div>
          </Link>
        )}
      </div>
      <div className="pagination-nav__item pagination-nav__item--next">
        {next && (
          <Link className="pagination-nav__link" to={next.permalink}>
            <div className="pagination-nav__sublabel">
              <Translate
                id="theme.docs.paginator.next"
                description="The label used to navigate to the next doc">
                Next
              </Translate>
            </div>
            <div className="pagination-nav__label">{next.title} &raquo;</div>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default DocPaginator;
