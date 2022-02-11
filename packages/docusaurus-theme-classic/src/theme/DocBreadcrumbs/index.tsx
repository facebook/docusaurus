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
