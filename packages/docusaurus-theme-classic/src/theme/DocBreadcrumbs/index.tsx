/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import {ThemeClassNames, useSidebarBreadcrumbs} from '@docusaurus/theme-common';
import styles from './styles.module.css';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

// TODO move to design system folder
function BreadcrumbsItemLink({
  children,
  href,
}: {
  children: ReactNode;
  href?: string;
}): JSX.Element {
  const className = clsx('breadcrumbs__link', styles.breadcrumbsItemLink);
  return href ? (
    <Link className={className} href={href} itemProp="item">
      <span itemProp="name">{children}</span>
    </Link>
  ) : (
    <span className={className} itemProp="item name">
      {children}
    </span>
  );
}

// TODO move to design system folder
function BreadcrumbsItem({
  children,
  active,
  position,
}: {
  children: ReactNode;
  active?: boolean;
  position?: string;
}): JSX.Element {
  return (
    <li
      itemScope
      itemProp="itemListElement"
      itemType="https://schema.org/ListItem"
      className={clsx('breadcrumbs__item', {
        'breadcrumbs__item--active': active,
      })}>
      {children}
      <meta itemProp="position" content={position} />
    </li>
  );
}

function HomeBreadcrumbItem() {
  return (
    <li className="breadcrumbs__item">
      <Link
        className={clsx('breadcrumbs__link', styles.breadcrumbsItemLink)}
        href={useBaseUrl('/')}>
        🏠
      </Link>
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
      <ul
        className="breadcrumbs"
        itemScope
        itemType="https://schema.org/BreadcrumbList">
        <HomeBreadcrumbItem />
        {breadcrumbs.map((item, idx) => (
          <BreadcrumbsItem
            key={idx}
            active={idx === breadcrumbs.length - 1}
            position={String(idx + 1)}>
            <BreadcrumbsItemLink href={item.href}>
              {item.label}
            </BreadcrumbsItemLink>
          </BreadcrumbsItem>
        ))}
      </ul>
    </nav>
  );
}
