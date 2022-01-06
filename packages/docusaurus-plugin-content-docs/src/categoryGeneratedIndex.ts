/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {CategoryGeneratedIndexMetadata, DocMetadataBase} from './types';
import type {SidebarItemCategoryWithGeneratedIndex} from './sidebars/types';
import {type SidebarsUtils, toNavigationLink} from './sidebars/utils';
import {createDocsByIdIndex} from './docs';

function getCategoryGeneratedIndexMetadata({
  category,
  sidebarsUtils,
  docsById,
}: {
  category: SidebarItemCategoryWithGeneratedIndex;
  sidebarsUtils: SidebarsUtils;
  docsById: Record<string, DocMetadataBase>;
}): CategoryGeneratedIndexMetadata {
  const {sidebarName, previous, next} =
    sidebarsUtils.getCategoryGeneratedIndexNavigation(category.link.permalink);
  if (!sidebarName) {
    throw new Error('unexpected');
  }

  return {
    title: category.link.title ?? category.label,
    description: category.link.description,
    image: category.link.image,
    keywords: category.link.keywords,
    slug: category.link.slug,
    permalink: category.link.permalink,
    sidebar: sidebarName,
    previous: toNavigationLink(previous, docsById),
    next: toNavigationLink(next, docsById),
  };
}

export function getCategoryGeneratedIndexMetadataList({
  docs,
  sidebarsUtils,
}: {
  sidebarsUtils: SidebarsUtils;
  docs: DocMetadataBase[];
}): CategoryGeneratedIndexMetadata[] {
  const docsById = createDocsByIdIndex(docs);

  const categoryGeneratedIndexItems =
    sidebarsUtils.getCategoryGeneratedIndexList();
  return categoryGeneratedIndexItems.map((category) =>
    getCategoryGeneratedIndexMetadata({
      category,
      sidebarsUtils,
      docsById,
    }),
  );
}
