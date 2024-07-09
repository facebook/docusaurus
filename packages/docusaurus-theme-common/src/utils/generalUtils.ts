/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
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
  getLabel: (item: T) => string | undefined,
  mapResult: (letter: string | undefined, items: T[]) => R,
): R[] {
  // Group items by their initial letter or undefined
  const groups = _.groupBy(items, (item) => {
    const label = getLabel(item);
    return label ? label[0]!.toUpperCase() : 'undefined';
  });

  // Convert groups object to array and sort
  return _.chain(groups)
    .toPairs()
    .sortBy(([letter]) => (letter === 'undefined' ? '' : letter))
    .map(([letter, groupedItems]) => {
      // Sort items within each group
      const sortedItems = _.sortBy(
        groupedItems,
        (item) => getLabel(item) ?? '',
      );
      return mapResult(
        letter === 'undefined' ? undefined : letter,
        sortedItems,
      );
    })
    .value();
}

export function listTagsByLetters(
  tags: readonly TagsListItem[],
): TagLetterEntry[] {
  return listByLetters(
    tags,
    (tag) => tag.label,
    (letter, items) => ({letter, tags: items}),
  );
}

export function listAuthorsByLetters(
  authors: readonly AuthorItemProp[],
): AuthorLetterEntry[] {
  return listByLetters(
    authors,
    (author) => author.name,
    (letter, items) => ({letter, authors: items}),
  );
}
