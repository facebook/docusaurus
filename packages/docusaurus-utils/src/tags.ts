/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {kebabCase, uniq, uniqBy} from 'lodash';
import {normalizeUrl} from './normalizeUrl';

export type Tag = {
  label: string;
  permalink: string;
};

export type FrontMatterTag = string | Tag;

export function normalizeFrontMatterTag(
  tagsPath: string,
  frontMatterTag: FrontMatterTag,
): Tag {
  function toTagObject(tagString: string): Tag {
    return {
      label: tagString,
      permalink: kebabCase(tagString),
    };
  }

  // TODO maybe make ensure the permalink is valid url path?
  function normalizeTagPermalink(permalink: string): string {
    // note: we always apply tagsPath on purpose
    // for versioned docs, v1/doc.md and v2/doc.md tags with custom permalinks don't lead to the same created page
    // tagsPath is different for each doc version
    return normalizeUrl([tagsPath, permalink]);
  }

  const tag: Tag =
    typeof frontMatterTag === 'string'
      ? toTagObject(frontMatterTag)
      : frontMatterTag;

  return {
    label: tag.label,
    permalink: normalizeTagPermalink(tag.permalink),
  };
}

export function normalizeFrontMatterTags(
  tagsPath: string,
  frontMatterTags: FrontMatterTag[] | undefined,
): Tag[] {
  const tags =
    frontMatterTags?.map((tag) => normalizeFrontMatterTag(tagsPath, tag)) ?? [];

  return uniqBy(tags, (tag) => tag.permalink);
}

export type TaggedItemGroup<Item> = {
  tag: Tag;
  items: Item[];
};

// Permits to group docs/blogPosts by tag (provided by FrontMatter)
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
