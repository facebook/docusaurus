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
} from '@docusaurus/theme-common';
import type {TagType, User} from '@site/src/data/users';
import {sortedUsers} from '@site/src/data/users';

export function useSearchName() {
  return useQueryString('name');
}

export function useTags() {
  return useQueryStringList('tags');
}

type Operator = 'OR' | 'AND';

export function useOperator(): readonly [Operator, () => void] {
  const [searchOperator, setSearchOperator] = useQueryString('operator');
  const operator: Operator = searchOperator === 'AND' ? 'AND' : 'OR';

  const toggleOperator = useCallback(() => {
    setSearchOperator(operator === 'OR' ? 'AND' : null);
  }, [operator, setSearchOperator]);

  return [operator, toggleOperator] as const;
}

function filterUsers({
  users,
  tags,
  operator,
  searchName,
}: {
  users: User[];
  tags: TagType[];
  operator: Operator;
  searchName: string | null;
}): User[] {
  let filtered = users;

  // Filter by name (case-insensitive)
  if (searchName) {
    const search = searchName.toLocaleLowerCase();
    filtered = filtered.filter((user) =>
      user.title.toLocaleLowerCase().includes(search),
    );
  }

  // If no tags, return name-filtered users
  if (tags.length === 0) {
    return filtered;
  }

  return filtered.filter((user) => {
    if (!user.tags || user.tags.length === 0) {
      return false;
    }

    // Filter by AND/OR operator logic
    return operator === 'AND'
      ? tags.every((tag) => user.tags.includes(tag))
      : tags.some((tag) => user.tags.includes(tag));
  });
}

export function useFilteredUsers(): User[] {
  const [tags] = useTags();
  const [searchName] = useSearchName();
  const [operator] = useOperator();

  return useMemo(
    () =>
      filterUsers({
        users: sortedUsers,
        tags: tags as TagType[],
        operator,
        searchName,
      }),
    [tags, operator, searchName],
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
            'Pluralized label for the number of sites found on the showcase. Use as many plural forms (separated by "|") as your language supports.',
          message: '1 site|{sitesCount} sites',
        },
        {sitesCount},
      ),
    );
}
