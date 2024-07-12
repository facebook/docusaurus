/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {AuthorItemProp} from '@docusaurus/plugin-content-blog';
import type {TagsListItem} from '@docusaurus/utils';

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

export type Entry = HasLabel | HasName;

export type LetterEntry<T> = {letter: string | undefined; items: T[]};

/**
 * Takes a list of tags or author (as provided by the content plugins),
 * and groups them by their initials.
 */
export function listByLetters<T extends Entry>(
  items: readonly T[],
  getLabel: (item: T) => string | undefined,
): LetterEntry<T>[] {
  // Group items by their initial letter or undefined
  const groups: Record<string, T[]> = items.reduce((acc, item) => {
    const label = getLabel(item);
    const key = label ? label[0]!.toUpperCase() : 'undefined';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);

  // Convert groups object to array and sort
  return Object.entries(groups)
    .sort(([a], [b]) => {
      if (a === 'undefined') {
        return 1;
      } else if (b === 'undefined') {
        return -1;
      } else {
        return a.localeCompare(b);
      }
    })
    .map(([letter, groupedItems]) => {
      // Sort items within each group
      const sortedItems = groupedItems.slice().sort((a, b) => {
        const labelA = getLabel(a) ?? '';
        const labelB = getLabel(b) ?? '';
        return labelA.localeCompare(labelB);
      });
      return {
        letter: letter === 'undefined' ? undefined : letter,
        items: sortedItems,
      };
    });
}

export function listTagsByLetters(
  tags: readonly TagsListItem[],
): LetterEntry<TagsListItem>[] {
  return listByLetters(tags, (tag) => tag.label);
}

export function listAuthorsByLetters(
  authors: readonly AuthorItemProp[],
): LetterEntry<AuthorItemProp>[] {
  return listByLetters(authors, (author) => author.name);
}
