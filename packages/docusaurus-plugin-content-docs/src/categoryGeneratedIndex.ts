/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {type SidebarsUtils, toNavigationLink} from './sidebars/utils';
import {createDocsByIdIndex} from './docs';
import type {LoadContext} from '@docusaurus/types';
import type {
  CategoryGeneratedIndexMetadata,
  DocMetadataBase,
} from '@docusaurus/plugin-content-docs';
import type {SidebarItemCategoryWithGeneratedIndex} from './sidebars/types';

function getCategoryGeneratedIndexMetadata({
  category,
  sidebarsUtils,
  docsById,
  context,
  version,
}: {
  category: SidebarItemCategoryWithGeneratedIndex;
  sidebarsUtils: SidebarsUtils;
  docsById: {[docId: string]: DocMetadataBase};
  context?: LoadContext;
  version?: string;
}): CategoryGeneratedIndexMetadata {
  const {sidebarName, previous, next} =
    sidebarsUtils.getCategoryGeneratedIndexNavigation(category.link.permalink);
  const title = category.link.title ?? category.label;
  const {slug} = category.link;
  return {
    title,
    description: category.link.description,
    image: category.link.image,
    keywords: category.link.keywords,
    slug,
    permalink: category.link.permalink,
    sidebar: sidebarName!,
    navigation: {
      previous: toNavigationLink(previous, docsById),
      next: toNavigationLink(next, docsById),
    },
    socialCardUrl: context?.siteConfig.socialCardService.getUrl(
      {
        title,
        version,
        type: 'docs',
        slug,
      },
      context.siteConfig.socialCardService.options,
    ),
  };
}

export function getCategoryGeneratedIndexMetadataList({
  docs,
  sidebarsUtils,
  context,
  version,
}: {
  sidebarsUtils: SidebarsUtils;
  docs: DocMetadataBase[];
  context?: LoadContext;
  version?: string;
}): CategoryGeneratedIndexMetadata[] {
  const docsById = createDocsByIdIndex(docs);

  const categoryGeneratedIndexItems =
    sidebarsUtils.getCategoryGeneratedIndexList();
  return categoryGeneratedIndexItems.map((category) =>
    getCategoryGeneratedIndexMetadata({
      category,
      sidebarsUtils,
      docsById,
      context,
      version,
    }),
  );
}
