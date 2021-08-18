/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';

import type {Props, TagsListItem} from '@theme/TagsListByLetter';

function getTagLetter(tag: string): string {
  return tag[0].toUpperCase();
}

type TagLetterEntry = Readonly<{letter: string; tags: TagsListItem[]}>;

function listTagsByLetters(tags: readonly TagsListItem[]): TagLetterEntry[] {
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

function TagLetterEntryItem({letterEntry}: {letterEntry: TagLetterEntry}) {
  return (
    <div>
      <h2>{letterEntry.letter}</h2>
      {letterEntry.tags.map((tag) => (
        <Link
          className="padding-right--md"
          href={tag.permalink}
          key={tag.permalink}>
          {tag.name} ({tag.count})
        </Link>
      ))}
      <hr />
    </div>
  );
}

function TagsListByLetter({tags}: Props): JSX.Element {
  const letterList = listTagsByLetters(tags);
  return (
    <section className="margin-vert--lg">
      {letterList.map((letterEntry) => (
        <TagLetterEntryItem
          key={letterEntry.letter}
          letterEntry={letterEntry}
        />
      ))}
    </section>
  );
}

export default TagsListByLetter;
