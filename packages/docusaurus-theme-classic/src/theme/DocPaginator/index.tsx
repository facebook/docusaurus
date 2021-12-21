/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {translate} from '@docusaurus/Translate';
import DocPaginatorNavLink from '@theme/DocPaginatorNavLink';
import type {Props} from '@theme/DocPaginator';

function DocPaginator(props: Props): JSX.Element {
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
        {previous && <DocPaginatorNavLink navLink={previous} />}
      </div>
      <div className="pagination-nav__item pagination-nav__item--next">
        {next && <DocPaginatorNavLink navLink={next} next />}
      </div>
    </nav>
  );
}

export default DocPaginator;
