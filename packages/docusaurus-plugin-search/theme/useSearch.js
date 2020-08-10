/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext} from 'react';
import {groupBy, sortBy} from 'lodash-es';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import Fuse from 'fuse.js';

const ELEMENTS = {
  h1: 3,
  h2: 2,
  h3: 1,
  p: 0.5,
};

const score = (elements) =>
  elements.reduce((acc, cur) => acc + (1 - cur.score) * ELEMENTS[cur.type], 0);

const sortType = (data) => sortBy(data, 'type');

const rank = (list) => {
  const result = list.slice(0, 100).filter((v) => v.score < 0.5);
  const data = groupBy(
    result.map((v) => ({...v.item, match: v.matches})),
    'pageID',
  );
  const ranked = sortBy(
    Object.entries(data).map(([key, value]) => ({
      key,
      value: score(value),
    })),
    'value',
  ).reverse();
  return ranked.map(({key}) => ({key, value: sortType(data[key])}));
};

export const FuseContext = React.createContext(undefined);

export function useSearch() {
  const {withBaseUrl} = useBaseUrlUtils();
  const {fuse, setFuse} = useContext(FuseContext);
  const getData = React.useCallback(() => {
    return Promise.all([
      fetch(withBaseUrl('search_index.json')).then((res) => res.json()),
      fetch(withBaseUrl('search_result.json')).then((res) => res.json()),
    ]).then((res) => {
      const newFuse = new Fuse(
        res[1],
        {
          threshold: 1,
          distance: 100,
          minMatchCharLength: 3,
          includeMatches: true,
          includeScore: true,
        },
        Fuse.parseIndex(res[0]),
      );
      setFuse(newFuse);
      return newFuse;
    });
  }, [setFuse]);
  return async (term) => {
    if (!fuse) {
      const newFuse = await getData();
      return rank(newFuse.search(term));
    }
    return rank(fuse.search(term));
  };
}
