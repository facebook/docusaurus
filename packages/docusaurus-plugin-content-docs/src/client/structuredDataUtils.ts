/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {PropSidebarBreadcrumbsItem} from '@docusaurus/plugin-content-docs';
import type {WithContext, BreadcrumbList} from 'schema-dts';

export function useBreadcrumbsStructuredData({
  breadcrumbs,
}: {
  breadcrumbs: PropSidebarBreadcrumbsItem[];
}): WithContext<BreadcrumbList> {
  const {siteConfig} = useDocusaurusContext();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.label,
      // We keep items without links (as they are part of the path),
      // even though previously filtered (see https://github.com/facebook/docusaurus/issues/9319#issuecomment-2643560845)
      ...(breadcrumb.href ? {item: `${siteConfig.url}${breadcrumb.href}`} : {}),
    })),
  };
}
