/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {ThemeClassNames, useSidebarBreadcrumbs} from '@docusaurus/theme-common';
import styles from './styles.module.css';
import clsx from 'clsx';
import type {PropSidebarBreadcrumbsItem} from '@docusaurus/plugin-content-docs';
import Link from '@docusaurus/Link';

function DocBreadcrumbsItemContent({
  item,
}: {
  item: PropSidebarBreadcrumbsItem;
}): JSX.Element {
  const className = clsx('breadcrumbs__link', styles.breadcrumbItem);

  return item.href ? (
    <Link className={className} href={item.href}>
      {item.label}
    </Link>
  ) : (
    <span className={className}>{item.label}</span>
  );
}

function DocBreadcrumbsItem({
  item,
}: {
  item: PropSidebarBreadcrumbsItem;
}): JSX.Element {
  return (
    <li className="breadcrumbs__item">
      <DocBreadcrumbsItemContent item={item} />
    </li>
  );
}

export default function DocBreadcrumbs(): JSX.Element | null {
  const breadcrumbs = useSidebarBreadcrumbs();

  if (!breadcrumbs) {
    return null;
  }

  return (
    <nav
      className={clsx(
        ThemeClassNames.docs.docBreadcrumbs,
        styles.breadcrumbsContainer,
      )}
      aria-label="breadcrumbs">
      <ul className="breadcrumbs">
        {breadcrumbs.map((item, idx) => (
          <DocBreadcrumbsItem key={idx} item={item} />
        ))}
      </ul>
    </nav>
  );
}
