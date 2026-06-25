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
    itemListElement: breadcrumbs
      // We filter breadcrumb items without links, they are not allowed
      // See also https://github.com/facebook/docusaurus/issues/9319#issuecomment-2643560845
      // We also filter unlisted category links: the href is present on the
      // item (so the sidebar highlight still works) but must not be emitted
      // into structured data where it would be crawled by search engines.
      .filter(
        (breadcrumb) =>
          breadcrumb.href &&
          !(breadcrumb.type === 'category' && breadcrumb.linkUnlisted),
      )
      .map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.label,
        item: `${siteConfig.url}${breadcrumb.href}`,
      })),
  };
}
