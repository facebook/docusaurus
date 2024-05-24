/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import logger from '@docusaurus/logger';
import {normalizeUrl} from './urlUtils';

/** What the user configures. */
export type Tag = {
  label: string;
  /** Permalink to this tag's page, without the `/tags/` base path. */
  permalink: string;
  // TODO do we use it in practice?
  description?: string;
};

// TODO add TagsFileInput=>TagsFile transformation + unit tests
export type TagsFileInput = Record<string, Partial<Tag>>;

export type TagsFile = Record<string, Tag>;

// Tags plugins options shared between docs/blog
export type TagsPluginOptions = {
  // TODO rename to tags?
  // TODO allow option tags later? | TagsFile;
  tagsFilePath: string | false | null | undefined;
  // TODO rename to onInlineTags
  onUnknownTags: 'ignore' | 'log' | 'warn' | 'throw';
};

export type NormalizedTag = Tag & {
  inline: boolean;
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
  /** Is this tag unlisted? (when it only contains unlisted items) */
  unlisted: boolean;
};

export type FrontMatterTag = string | Tag;

// TODO maybe make ensure the permalink is valid url path?
function normalizeTagPermalink({
  tagsPath,
  permalink,
}: {
  tagsPath: string;
  permalink: string;
}): string {
  // Note: we always apply tagsPath on purpose. For versioned docs, v1/doc.md
  // and v2/doc.md tags with custom permalinks don't lead to the same created
  // page. tagsPath is different for each doc version
  return normalizeUrl([tagsPath, permalink]);
}

// TODO old legacy method, to refactor
function normalizeInlineTag(
  tagsPath: string,
  frontMatterTag: FrontMatterTag,
): NormalizedTag {
  function toTagObject(tagString: string): NormalizedTag {
    return {
      inline: true,
      label: tagString,
      permalink: _.kebabCase(tagString),
      description: undefined,
    };
  }

  const tag: Tag =
    typeof frontMatterTag === 'string'
      ? toTagObject(frontMatterTag)
      : frontMatterTag;

  return {
    inline: true,
    label: tag.label,
    permalink: normalizeTagPermalink({permalink: tag.permalink, tagsPath}),
    description: tag.description,
  };
}

export function normalizeTag({
  tag,
  tagsFile,
  tagsPath,
}: {
  tag: FrontMatterTag;
  tagsPath: string;
  tagsFile: TagsFile | null;
}): NormalizedTag {
  if (typeof tag === 'string') {
    const tagDescription = tagsFile?.[tag];
    if (tagDescription) {
      // pre-defined tag from tags.yml
      return {
        inline: false,
        label: tagDescription.label,
        permalink: normalizeTagPermalink({
          permalink: tagDescription.permalink,
          tagsPath,
        }),
        description: tagDescription.description,
      };
    }
  }
  // legacy inline tag object, always inline, unknown because isn't a string
  return normalizeInlineTag(tagsPath, tag);
}

export function normalizeTags({
  tagsPath,
  tagsFile,
  frontMatterTags,
}: {
  tagsPath: string;
  tagsFile: TagsFile | null;
  frontMatterTags: FrontMatterTag[];
}): NormalizedTag[] {
  const tags = frontMatterTags.map((tag) =>
    normalizeTag({tag, tagsPath, tagsFile}),
  );

  // TODO old legacy behavior
  //  emit errors in case of conflicts instead
  return _.uniqBy(tags, (tag) => tag.permalink);
  // return tags;
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

/**
 * Permits to get the "tag visibility" (hard to find a better name)
 * IE, is this tag listed or unlisted
 * And which items should be listed when this tag is browsed
 */
export function getTagVisibility<Item>({
  items,
  isUnlisted,
}: {
  items: Item[];
  isUnlisted: (item: Item) => boolean;
}): {
  unlisted: boolean;
  listedItems: Item[];
} {
  const allItemsUnlisted = items.every(isUnlisted);
  // When a tag is full of unlisted items, we display all the items
  // when tag is browsed, but we mark the tag as unlisted
  if (allItemsUnlisted) {
    return {unlisted: true, listedItems: items};
  }
  // When a tag has some listed items, the tag remains listed
  // but we filter its unlisted items
  return {
    unlisted: false,
    listedItems: items.filter((item) => !isUnlisted(item)),
  };
}

export function validateFrontMatterTags({
  tags,
  source,
  options,
}: {
  tags: NormalizedTag[];
  source: string;
  options: TagsPluginOptions;
}): void {
  const inlineTags = tags.filter((tag) => tag.inline);
  if (inlineTags.length > 0 && options.onUnknownTags !== 'ignore') {
    const uniqueUnknownTags = [...new Set(inlineTags.map((tag) => tag.label))];
    const tagListString = uniqueUnknownTags.join(', ');
    logger.report(options.onUnknownTags)(
      `Tags [${tagListString}] used in ${source} are not defined in ${options.tagsFilePath}`,
    );
  }
}

export function processFileTagsPath({
  options,
  source,
  frontMatterTags,
  versionTagsPath,
  tagsFile,
}: {
  options: TagsPluginOptions;
  source: string;
  frontMatterTags: FrontMatterTag[] | undefined;
  versionTagsPath: string;
  tagsFile: TagsFile | null;
}): NormalizedTag[] {
  const tags = normalizeTags({
    tagsPath: versionTagsPath,
    tagsFile,
    frontMatterTags: frontMatterTags ?? [],
  });

  validateFrontMatterTags({
    tags,
    source,
    options,
  });

  return tags;
}
