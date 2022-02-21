/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizeUrl} from '@docusaurus/utils';
import type {
  SidebarItem,
  Sidebars,
  SidebarProcessorParams,
  ProcessedSidebarItemCategory,
  ProcessedSidebarItem,
  ProcessedSidebars,
  SidebarItemCategoryLink,
} from './types';
import _ from 'lodash';

function normalizeCategoryLink(
  category: ProcessedSidebarItemCategory,
  params: SidebarProcessorParams,
): SidebarItemCategoryLink | undefined {
  if (category.link?.type === 'generated-index') {
    // default slug logic can be improved
    const getDefaultSlug = () =>
      `/category/${params.categoryLabelSlugger.slug(category.label)}`;
    const slug = category.link.slug ?? getDefaultSlug();
    const permalink = normalizeUrl([params.version.versionPath, slug]);
    return {
      ...category.link,
      slug,
      permalink,
    };
  }
  return category.link;
}

function postProcessSidebarItem(
  item: ProcessedSidebarItem,
  params: SidebarProcessorParams,
): SidebarItem {
  if (item.type === 'category') {
    const category = {
      ...item,
      collapsed: item.collapsed ?? params.sidebarOptions.sidebarCollapsed,
      collapsible: item.collapsible ?? params.sidebarOptions.sidebarCollapsible,
      link: normalizeCategoryLink(item, params),
      items: item.items.map((subItem) =>
        postProcessSidebarItem(subItem, params),
      ),
    };
    // If the current category doesn't have subitems, we render a normal link
    // instead.
    if (category.items.length === 0) {
      if (!category.link) {
        throw new Error(
          `Sidebar category ${item.label} has neither any subitem nor a link. This makes this item not able to link to anything.`,
        );
      }
      switch (category.link.type) {
        case 'doc':
          return {
            type: 'doc',
            label: category.label,
            id: category.link.id,
          };
        case 'generated-index':
          return {
            type: 'link',
            label: category.label,
            href: category.link.permalink,
          };
        default:
          throw new Error('Unexpected sidebar category link type');
      }
    }
    // A non-collapsible category can't be collapsed!
    if (category.collapsible === false) {
      category.collapsed = false;
    }
    return category;
  }
  return item;
}

export function postProcessSidebars(
  sidebars: ProcessedSidebars,
  params: SidebarProcessorParams,
): Sidebars {
  return _.mapValues(sidebars, (sidebar) =>
    sidebar.map((item) => postProcessSidebarItem(item, params)),
  );
}
