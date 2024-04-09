/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useEffect, useMemo, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import {translate} from '@docusaurus/Translate';
import {usePluralForm} from '@docusaurus/theme-common';
import type {TagType, User} from '@site/src/data/users';
import {sortedUsers} from '@site/src/data/users';
import type {Operator} from '@site/src/pages/showcase/_components/OperatorButton';
import {
  DefaultOperator,
  readOperator,
} from '@site/src/pages/showcase/_components/OperatorButton';
import {readSearchTags} from '@site/src/pages/showcase/_components/ShowcaseTagSelect';

const SearchNameQueryKey = 'name';

export function readSearchName(search: string) {
  return new URLSearchParams(search).get(SearchNameQueryKey);
}

export function setSearchName(search: string, value: string): string {
  const newSearch = new URLSearchParams(search);
  newSearch.delete(SearchNameQueryKey);
  if (value) {
    newSearch.set(SearchNameQueryKey, value);
  }
  return newSearch.toString();
}

function filterUsers(
  users: User[],
  selectedTags: TagType[],
  operator: Operator,
  searchName: string | null,
) {
  if (searchName) {
    // eslint-disable-next-line no-param-reassign
    users = users.filter((user) =>
      user.title.toLowerCase().includes(searchName.toLowerCase()),
    );
  }
  if (selectedTags.length === 0) {
    return users;
  }
  return users.filter((user) => {
    if (user.tags.length === 0) {
      return false;
    }
    if (operator === 'AND') {
      return selectedTags.every((tag) => user.tags.includes(tag));
    }
    return selectedTags.some((tag) => user.tags.includes(tag));
  });
}

export function useFilteredUsers() {
  const location = useLocation();
  const [operator, setOperator] = useState<Operator>(DefaultOperator);
  // On SSR / first mount (hydration) no tag is selected
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [name, setName] = useState<string | null>(null);
  // Sync tags from QS to state (delayed on purpose to avoid SSR/Client
  // hydration mismatch)
  useEffect(() => {
    setSelectedTags(readSearchTags(location.search));
    setOperator(readOperator(location.search));
    setName(readSearchName(location.search));
  }, [location]);

  return useMemo(
    () => filterUsers(sortedUsers, selectedTags, operator, name),
    [selectedTags, operator, name],
  );
}

export function useSiteCountPlural() {
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
