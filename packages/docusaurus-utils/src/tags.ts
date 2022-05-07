/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {normalizeUrl} from './urlUtils';

/** What the user configures. */
export type Tag = {
  label: string;
  /** Permalink to this tag's page, without the `/tags/` base path. */
  permalink: string;
};

/** What the tags list page should know about each tag. */
export type TagsListItem = Tag & {
  /** Number of posts/docs with this tag. */
  count: number;
};

/** What the tag's own page should know about the tag. */
export type TagModule = TagsListItem & {
  /** The tags list page's permalink. */
  allTagsPath: string;
};

export type FrontMatterTag = string | Tag;

function normalizeFrontMatterTag(
  tagsPath: string,
  frontMatterTag: FrontMatterTag,
): Tag {
  function toTagObject(tagString: string): Tag {
    return {
      label: tagString,
      permalink: _.kebabCase(tagString),
    };
  }

  // TODO maybe make ensure the permalink is valid url path?
  function normalizeTagPermalink(permalink: string): string {
    // Note: we always apply tagsPath on purpose. For versioned docs, v1/doc.md
    // and v2/doc.md tags with custom permalinks don't lead to the same created
    // page. tagsPath is different for each doc version
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

/**
 * Takes tag objects as they are defined in front matter, and normalizes each
 * into a standard tag object. The permalink is created by appending the
 * sluggified label to `tagsPath`. Front matter tags already containing
 * permalinks would still have `tagsPath` prepended.
 *
 * The result will always be unique by permalinks. The behavior with colliding
 * permalinks is undetermined.
 */
export function normalizeFrontMatterTags(
  /** Base path to append the tag permalinks to. */
  tagsPath: string,
  /** Can be `undefined`, so that we can directly pipe in `frontMatter.tags`. */
  frontMatterTags: FrontMatterTag[] | undefined = [],
): Tag[] {
  const tags = frontMatterTags.map((tag) =>
    normalizeFrontMatterTag(tagsPath, tag),
  );

  return _.uniqBy(tags, (tag) => tag.permalink);
}

type TaggedItemGroup<Item> = {
  tag: Tag;
  items: Item[];
};

/**
 * Permits to group docs/blog posts by tag (provided by front matter).
 *
 * @returns a map from tag permalink to the items and other relevant tag data.
 * The record is indexed by permalink, because routes must be unique in the end.
 * Labels may vary on 2 MD files but they are normalized. Docs with
 * label='some label' and label='some-label' should end up in the same page.
 */
export function groupTaggedItems<Item>(
  items: readonly Item[],
  /**
   * A callback telling me how to get the tags list of the current item. Usually
   * simply getting it from some metadata of the current item.
   */
  getItemTags: (item: Item) => readonly Tag[],
): {[permalink: string]: TaggedItemGroup<Item>} {
  const result: {[permalink: string]: TaggedItemGroup<Item>} = {};

  items.forEach((item) => {
    getItemTags(item).forEach((tag) => {
      // Init missing tag groups
      // TODO: it's not really clear what should be the behavior if 2 tags have
      // the same permalink but the label is different for each
      // For now, the first tag found wins
      result[tag.permalink] ??= {
        tag,
        items: [],
      };

      // Add item to group
      result[tag.permalink]!.items.push(item);
    });
  });

  // If user add twice the same tag to a md doc (weird but possible),
  // we don't want the item to appear twice in the list...
  Object.values(result).forEach((group) => {
    group.items = _.uniq(group.items);
  });

  return result;
}
