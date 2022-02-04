/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {
  isSamePath,
  ThemeClassNames,
  useSidebarBreadcrumbs,
  useThemeConfig,
} from '@docusaurus/theme-common';
import styles from './styles.module.css';
import clsx from 'clsx';
import {useLocation} from '@docusaurus/router';
import type {PropSidebar} from '@docusaurus/plugin-content-docs';

export default function DocBreadcrumbs(): JSX.Element | null {
  const {pathname} = useLocation();
  const breadcrumbs = useSidebarBreadcrumbs();
  const {breadcrumbs: enabled} = useThemeConfig();

  function isExact(items: PropSidebar) {
    const singleItem = items[0];
    return (
      items.length === 1 &&
      singleItem.type === 'link' &&
      isSamePath(singleItem.href, pathname)
    );
  }

  if (
    !breadcrumbs.length ||
    enabled === false ||
    (enabled === 'nested' && isExact(breadcrumbs))
  ) {
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
        {breadcrumbs.map((breadcrumb, idx) => (
          <li key={idx} className="breadcrumbs__item">
            {breadcrumb.type === 'link' && (
              <a
                className={clsx('breadcrumbs__link', styles.breadcrumbItem)}
                href={breadcrumb.href}>
                {breadcrumb.label}
              </a>
            )}
            {breadcrumb.type === 'category' && (
              <span
                className={clsx('breadcrumbs__link', styles.breadcrumbItem)}>
                {breadcrumb.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
