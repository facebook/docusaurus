/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback, useMemo} from 'react';
import {translate} from '@docusaurus/Translate';
import {
  usePluralForm,
  useQueryString,
  useQueryStringList,
  type ListUpdateFunction,
} from '@docusaurus/theme-common';
import useRouteContext from '@docusaurus/useRouteContext';
import type {
  TagType,
  Operator,
  ShowcaseItem,
  TagsOption,
} from '@docusaurus/plugin-content-showcase';

export function filterItems({
  items,
  tags,
  operator,
  searchName,
}: {
  items: ShowcaseItem[];
  tags: TagType[];
  operator: Operator;
  searchName: string | undefined | null;
}): ShowcaseItem[] {
  if (searchName) {
    // eslint-disable-next-line no-param-reassign
    items = items.filter((user) =>
      user.title.toLowerCase().includes(searchName.toLowerCase()),
    );
  }
  if (tags.length === 0) {
    return items;
  }
  return items.filter((user) => {
    if (user.tags.length === 0) {
      return false;
    }
    if (operator === 'AND') {
      return tags.every((tag) => user.tags.includes(tag));
    }
    return tags.some((tag) => user.tags.includes(tag));
  });
}

export function useSearchName(): [
  string,
  (newValue: string | null, options?: {push: boolean}) => void,
] {
  return useQueryString('name');
}

export function useTags(): [string[], ListUpdateFunction] {
  return useQueryStringList('tags');
}

export function useOperator(): [Operator, () => void] {
  const [searchOperator, setSearchOperator] = useQueryString('operator');
  const operator: Operator = searchOperator === 'AND' ? 'AND' : 'OR';
  const toggleOperator = useCallback(() => {
    const newOperator = operator === 'OR' ? 'AND' : null;
    setSearchOperator(newOperator);
  }, [operator, setSearchOperator]);
  return [operator, toggleOperator];
}

export function useFilteredItems(items: ShowcaseItem[]): ShowcaseItem[] {
  const [tags] = useTags();
  const [searchName] = useSearchName() ?? [''];
  const [operator] = useOperator();
  return useMemo(
    () =>
      filterItems({
        items,
        tags: tags as TagType[],
        operator,
        searchName,
      }),
    [items, tags, operator, searchName],
  );
}

export function useSiteCountPlural(): (sitesCount: number) => string {
  const {selectMessage} = usePluralForm();
  return (sitesCount: number) =>
    selectMessage(
      sitesCount,
      translate(
        {
          id: 'showcase.filters.resultCount',
          description:
            'Pluralized label for the number of sites found on the showcase. Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: '1 site|{sitesCount} sites',
        },
        {sitesCount},
      ),
    );
}

export function sortBy<T>(
  array: T[],
  getter: (item: T) => string | number | boolean,
): T[] {
  const sortedArray = [...array];
  sortedArray.sort((a, b) =>
    // eslint-disable-next-line no-nested-ternary
    getter(a) > getter(b) ? 1 : getter(b) > getter(a) ? -1 : 0,
  );
  return sortedArray;
}

export type Tag = {
  label: string;
  description: string;
  color: string;
};

export function sortItems(params: ShowcaseItem[]): ShowcaseItem[] {
  let result = params;
  // Sort by site name
  result = sortBy(result, (user) => user.title.toLowerCase());
  // Sort by favorite tag, favorites first
  result = sortBy(result, (user) => !user.tags.includes('favorite'));
  return result;
}

export interface ShowcaseContextType {
  items: ShowcaseItem[];
  tags: TagsOption;
  screenshotApi: string;
}

function useShowcase() {
  const routeContext = useRouteContext();
  console.log('routeContext:', routeContext);
  const showcase = routeContext?.data?.showcase;
  console.log('showcase:', showcase);
  if (!showcase) {
    throw new Error(
      'showcase-related hooks can only be called on the showcase page',
    );
  }
  return showcase as ShowcaseContextType;
}

export function useShowcaseItems(): ShowcaseItem[] {
  return useShowcase().items;
}

export function useShowcaseApiScreenshot(): string {
  return useShowcase().screenshotApi;
}

export function useShowcaseTags(): TagsOption {
  return useShowcase().tags;
}
