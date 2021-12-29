/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/PaginatorNavLink';

function PaginatorNavLink(props: Props): JSX.Element {
  const {navLink, type, subLabel} = props;
  return (
    <div
      className={clsx('pagination-nav__item', {
        'pagination-nav__item--next': type === 'next',
      })}>
      <Link className="pagination-nav__link" to={navLink.permalink}>
        <div className="pagination-nav__sublabel">{subLabel}</div>
        <div className="pagination-nav__label">{navLink.title}</div>
      </Link>
    </div>
  );
}

export default PaginatorNavLink;
