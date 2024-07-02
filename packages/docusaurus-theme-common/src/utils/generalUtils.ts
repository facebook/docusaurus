/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {TagLetterEntry} from './tagsUtils';
import type {AuthorItemProp} from '@docusaurus/plugin-content-blog';
import type {TagsListItem} from '@docusaurus/utils';
import type {AuthorLetterEntry} from './authorsUtils';

/**
 * Formats the page's title based on relevant site config and other contexts.
 */
export function useTitleFormatter(title?: string | undefined): string {
  const {siteConfig} = useDocusaurusContext();
  const {title: siteTitle, titleDelimiter} = siteConfig;
  return title?.trim().length
    ? `${title.trim()} ${titleDelimiter} ${siteTitle}`
    : siteTitle;
}
interface HasLabel {
  label: string;
}

interface HasName {
  name?: string;
  imageURL?: string;
}

type Entry = HasLabel | HasName;

/**
 * Takes a list of tags or author (as provided by the content plugins),
 * and groups them by their initials.
 */
function listByLetters<T extends Entry, R>(
  items: readonly T[],
  getLetter: (item: T) => string,
  getLabel: (item: T) => string,
  mapResult: (letter: string, items: T[]) => R,
): R[] {
  const groups: {[initial: string]: T[]} = {};
  items.forEach((item) => {
    const initial = getLetter(item);
    groups[initial] ??= [];
    groups[initial]!.push(item);
  });

  return (
    Object.entries(groups)
      // Sort letters
      .sort(([letter1], [letter2]) => letter1.localeCompare(letter2))
      .map(([letter, groupedItems]) => {
        // Sort items inside a letter
        const sortedItems = groupedItems.sort((item1, item2) =>
          getLabel(item1).localeCompare(getLabel(item2)),
        );
        return mapResult(letter, sortedItems);
      })
  );
}

function getItemLetter(item: string): string {
  return item[0]!.toUpperCase();
}

export function listTagsByLetters(
  tags: readonly TagsListItem[],
): TagLetterEntry[] {
  return listByLetters(
    tags,
    (tag) => getItemLetter(tag.label),
    (tag) => tag.label,
    (letter, items) => ({letter, tags: items}),
  );
}

export function listAuthorsByLetters(
  authors: readonly AuthorItemProp[],
): AuthorLetterEntry[] {
  return listByLetters(
    authors,
    (author) => getItemLetter(author.name ?? author.imageURL ?? ''),
    (author) => author.name ?? author.imageURL ?? '',
    (letter, items) => ({letter, authors: items}),
  );
}
