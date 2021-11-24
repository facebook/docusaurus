/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {CategoryGeneratedIndexMetadata, DocMetadataBase} from './types';
import {SidebarItemCategoryWithGeneratedIndex} from './sidebars/types';
import {SidebarsUtils, toNavigationLink} from './sidebars/utils';
import {keyBy} from 'lodash';

export function createCategoryGeneratedIndexMetadata({
  category,
  sidebarUtils,
  docsById,
}: {
  category: SidebarItemCategoryWithGeneratedIndex;
  sidebarUtils: SidebarsUtils;
  docsById: Record<string, DocMetadataBase>;
}): CategoryGeneratedIndexMetadata {
  const {sidebarName, previous, next} =
    sidebarUtils.getCategoryGeneratedIndexNavigation(category);
  if (!sidebarName) {
    throw new Error('unexpected');
  }

  return {
    title: category.label,
    slug: category.link.slug,
    permalink: category.link.permalink,
    sidebar: sidebarName,
    previous: previous ? toNavigationLink(previous, docsById) : undefined,
    next: next ? toNavigationLink(next, docsById) : undefined,
  };
}

export function getCategoryGeneratedIndexMetadata({
  category,
  sidebarsUtils,
  docsById,
}: {
  category: SidebarItemCategoryWithGeneratedIndex;
  sidebarsUtils: SidebarsUtils;
  docsById: Record<string, DocMetadataBase>;
}): CategoryGeneratedIndexMetadata {
  const {sidebarName, previous, next} =
    sidebarsUtils.getCategoryGeneratedIndexNavigation(category);
  if (!sidebarName) {
    throw new Error('unexpected');
  }

  return {
    title: category.label,
    slug: category.link.slug,
    permalink: category.link.permalink,
    sidebar: sidebarName,
    previous: previous ? toNavigationLink(previous, docsById) : undefined,
    next: next ? toNavigationLink(next, docsById) : undefined,
  };
}

export function getCategoryGeneratedIndexMetadataList({
  docs,
  sidebarsUtils,
}: {
  sidebarsUtils: SidebarsUtils;
  docs: DocMetadataBase[];
}): CategoryGeneratedIndexMetadata[] {
  const docsById = keyBy(docs, (doc) => doc.id);

  const categoryGeneratedIndexItems =
    sidebarsUtils.getCategoryGeneratedIndexList();
  return categoryGeneratedIndexItems.map((category) =>
    getCategoryGeneratedIndexMetadata({category, sidebarsUtils, docsById}),
  );
}
