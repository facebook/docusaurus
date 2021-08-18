/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {kebabCase, uniq} from 'lodash';
import {normalizeUrl} from './normalizeUrl';

export type Tag = {
  label: string;
  permalink: string;
};

export type FrontMatterTag = string | Tag;

export function normalizeFrontMatterTag(
  tagsPath: string,
  tag: FrontMatterTag,
): Tag {
  if (typeof tag === 'string') {
    const normalizedTag = kebabCase(tag);
    const permalink = normalizeUrl([tagsPath, normalizedTag]);
    return {
      label: tag,
      permalink,
    };
  }
  return tag;
}

export function normalizeFrontMatterTags(
  tagsPath: string,
  frontMatterTags: FrontMatterTag[] | undefined,
): Tag[] {
  return (
    frontMatterTags?.map((tag) => normalizeFrontMatterTag(tagsPath, tag)) ?? []
  );
}

export type TaggedItemGroup<Item> = {
  tag: Tag;
  items: Item[];
};

// Note: groups are indexed by permalink, because routes must be unique in the end
// Labels may vary on 2 md files but they are normalized.
// Docs with label='some label' and label='some-label' should end-up in the same group/page in the end
// We can't create 2 routes /some-label because one would override the other
export function groupTaggedItems<Item>(
  items: Item[],
  getItemTags: (item: Item) => Tag[],
): Record<string, TaggedItemGroup<Item>> {
  const result: Record<string, TaggedItemGroup<Item>> = {};

  function handleItemTag(item: Item, tag: Tag) {
    // Init missing tag groups
    // TODO: it's not really clear what should be the behavior if 2 items have the same tag but the permalink is different for each
    // For now, the first tag found wins
    result[tag.permalink] = result[tag.permalink] ?? {
      tag,
      items: [],
    };

    // Add item to group
    result[tag.permalink].items.push(item);
  }

  items.forEach((item) => {
    getItemTags(item).forEach((tag) => {
      handleItemTag(item, tag);
    });
  });

  // If user add twice the same tag to a md doc (weird but possible),
  // we don't want the item to appear twice in the list...
  Object.values(result).forEach((group) => {
    group.items = uniq(group.items);
  });

  return result;
}
