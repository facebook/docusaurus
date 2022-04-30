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

export default function PaginatorNavLink(props: Props): JSX.Element {
  const {permalink, title, subLabel, isPrev} = props;
  return (
    <Link
      className={clsx(
        'pagination-nav__link',
        isPrev ? 'pagination-nav__link--prev' : 'pagination-nav__link--next',
      )}
      to={permalink}>
      {subLabel && <div className="pagination-nav__sublabel">{subLabel}</div>}
      <div className="pagination-nav__label">{title}</div>
    </Link>
  );
}
