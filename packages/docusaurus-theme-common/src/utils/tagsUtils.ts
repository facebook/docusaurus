/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {translate} from '@docusaurus/Translate';
import type {CharMap} from '@docusaurus/types/src/i18n';
import type {TagsListItem} from '@docusaurus/utils';

export const translateTagsPageTitle = (): string =>
  translate({
    id: 'theme.tags.tagsPageTitle',
    message: 'Tags',
    description: 'The title of the tag list page',
  });

export type TagLetterEntry = {letter: string; tags: TagsListItem[]};

function getTagLetter(tag: string, charMap: CharMap | undefined): string {
  /**
   * tag[0] to get the first char, e.g. `开` in `开发笔记`
   * and then get its pinyin of `kai` from charMap
   * finally got the first alphabet of `k`
   */
  return (charMap?.[tag[0]!] || tag)[0]!.toUpperCase();
}

/**
 * Takes a list of tags (as provided by the content plugins), and groups them by
 * their initials.
 */
export function listTagsByLetters(
  tags: readonly TagsListItem[],
  charMap: CharMap | undefined,
): TagLetterEntry[] {
  const groups: {[initial: string]: TagsListItem[]} = {};
  Object.values(tags).forEach((tag) => {
    const initial = getTagLetter(tag.label, charMap);
    groups[initial] ??= [];
    groups[initial]!.push(tag);
  });

  return (
    Object.entries(groups)
      // Sort letters
      .sort(([letter1], [letter2]) => letter1.localeCompare(letter2))
      .map(([letter, letterTags]) => {
        // Sort tags inside a letter
        const sortedTags = letterTags.sort((tag1, tag2) =>
          tag1.label.localeCompare(tag2.label),
        );
        return {letter, tags: sortedTags};
      })
  );
}
