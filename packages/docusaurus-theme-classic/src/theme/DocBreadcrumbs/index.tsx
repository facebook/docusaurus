/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import {
  ThemeClassNames,
  useSidebarBreadcrumbs,
  useHomePageRoute,
} from '@docusaurus/theme-common';
import styles from './styles.module.css';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

// TODO move to design system folder
function BreadcrumbsItemLink({
  children,
  href,
  isLast,
}: {
  children: ReactNode;
  href: string | undefined;
  isLast: boolean;
}): JSX.Element {
  const className = 'breadcrumbs__link';
  if (isLast) {
    return (
      <span className={className} itemProp="name">
        {children}
      </span>
    );
  }
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
  index,
}: {
  children: ReactNode;
  active?: boolean;
  index: number;
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
      <meta itemProp="position" content={String(index + 1)} />
    </li>
  );
}

function HomeBreadcrumbItem() {
  const homeHref = useBaseUrl('/');
  return (
    <li className="breadcrumbs__item">
      <Link
        className={clsx('breadcrumbs__link', styles.breadcrumbsItemLink)}
        href={homeHref}>
        🏠
      </Link>
    </li>
  );
}

export default function DocBreadcrumbs(): JSX.Element | null {
  const breadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();

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
        {homePageRoute && <HomeBreadcrumbItem />}
        {breadcrumbs.map((item, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <BreadcrumbsItem key={idx} active={isLast} index={idx}>
              <BreadcrumbsItemLink href={item.href} isLast={isLast}>
                {item.label}
              </BreadcrumbsItemLink>
            </BreadcrumbsItem>
          );
        })}
      </ul>
    </nav>
  );
}
