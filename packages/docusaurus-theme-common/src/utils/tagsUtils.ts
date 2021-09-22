/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {translate} from '@docusaurus/Translate';

export const translateTagsPageTitle = (): string =>
  translate({
    id: 'theme.tags.tagsPageTitle',
    message: 'Tags',
    description: 'The title of the tag list page',
  });

type TagsListItem = Readonly<{name: string; permalink: string; count: number}>; // TODO remove duplicated type :s

export type TagLetterEntry = Readonly<{letter: string; tags: TagsListItem[]}>;

function getTagLetter(tag: string): string {
  return tag[0].toUpperCase();
}

export function listTagsByLetters(
  tags: readonly TagsListItem[],
): TagLetterEntry[] {
  // Group by letters
  const groups: Record<string, TagsListItem[]> = {};
  Object.values(tags).forEach((tag) => {
    const letter = getTagLetter(tag.name);
    groups[letter] = groups[letter] ?? [];
    groups[letter].push(tag);
  });

  return (
    Object.entries(groups)
      // Sort letters
      .sort(([letter1], [letter2]) => letter1.localeCompare(letter2))
      .map(([letter, letterTags]) => {
        // Sort tags inside a letter
        const sortedTags = letterTags.sort((tag1, tag2) =>
          tag1.name.localeCompare(tag2.name),
        );
        return {letter, tags: sortedTags};
      })
  );
}
