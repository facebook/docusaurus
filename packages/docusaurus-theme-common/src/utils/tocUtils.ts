/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useMemo} from 'react';
import {TOCItem} from '@docusaurus/types';

type FilterTOCParam = {
  toc: readonly TOCItem[];
  minHeadingLevel: number;
  maxHeadingLevel: number;
};

export function filterTOC({
  toc,
  minHeadingLevel,
  maxHeadingLevel,
}: FilterTOCParam): TOCItem[] {
  function isValid(item: TOCItem) {
    return item.level >= minHeadingLevel && item.level <= maxHeadingLevel;
  }

  return toc.flatMap((item) => {
    const filteredChildren = filterTOC({
      toc: item.children,
      minHeadingLevel,
      maxHeadingLevel,
    });
    if (isValid(item)) {
      return [
        {
          ...item,
          children: filteredChildren,
        },
      ];
    } else {
      return filteredChildren;
    }
  });
}

// Memoize potentially expensive filtering logic
export function useTOCFilter({
  toc,
  minHeadingLevel,
  maxHeadingLevel,
}: FilterTOCParam): readonly TOCItem[] {
  return useMemo(
    () => filterTOC({toc, minHeadingLevel, maxHeadingLevel}),
    [toc, minHeadingLevel, maxHeadingLevel],
  );
}
