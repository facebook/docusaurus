/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/PaginatorNavLink';

function PaginatorNavLink(props: Props): JSX.Element {
  const {navLink, subLabel} = props;
  return (
    <Link className="pagination-nav__link" to={navLink.permalink}>
      <div className="pagination-nav__sublabel">{subLabel}</div>
      {navLink.title && (
        <div className="pagination-nav__label">{navLink.title}</div>
      )}
    </Link>
  );
}

export default PaginatorNavLink;
