/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useMemo} from 'react';
import clsx from 'clsx';
import useTOCHighlight from '@theme/hooks/useTOCHighlight';
import type {TOCProps, TOCHeadingsProps} from '@theme/TOC';
import styles from './styles.module.css';
import {TOCItem} from '@docusaurus/types';

const LINK_CLASS_NAME = 'table-of-contents__link';

type FilterTOCParam = {
  toc: readonly TOCItem[];
  minHeadingLevel: number;
  maxHeadingLevel: number;
};

function filterTOC({
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
function useTOCFiltered({
  toc,
  maxHeadingLevel,
  minHeadingLevel,
}: FilterTOCParam): readonly TOCItem[] {
  return useMemo(() => filterTOC({toc, maxHeadingLevel, minHeadingLevel}), [
    toc,
    maxHeadingLevel,
    minHeadingLevel,
  ]);
}

type TOCHeadingListProps = {
  readonly toc: readonly TOCItem[];
  readonly isChild?: boolean;
};

/* eslint-disable jsx-a11y/control-has-associated-label */
function TOCHeadingList({
  toc,
  isChild,
}: TOCHeadingListProps): JSX.Element | null {
  if (!toc.length) {
    return null;
  }
  return (
    <ul
      className={
        isChild ? '' : 'table-of-contents table-of-contents__left-border'
      }>
      {toc.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            className={LINK_CLASS_NAME}
            // Developer provided the HTML, so assume it's safe.
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{__html: heading.value}}
          />
          <TOCHeadingList isChild toc={heading.children} />
        </li>
      ))}
    </ul>
  );
}

/* eslint-disable jsx-a11y/control-has-associated-label */
export function TOCHeadings({
  toc,
  maxHeadingLevel,
  minHeadingLevel,
}: TOCHeadingsProps): JSX.Element | null {
  const tocFiltered = useTOCFiltered({toc, minHeadingLevel, maxHeadingLevel});
  return <TOCHeadingList toc={tocFiltered} />;
}

function TOC({toc, ...props}: TOCProps): JSX.Element {
  // TODO defaults from themeConfig
  const minHeadingLevel = props.minHeadingLevel ?? 2;
  const maxHeadingLevel = props.maxHeadingLevel ?? 3;

  useTOCHighlight({
    linkClassName: LINK_CLASS_NAME,
    linkActiveClassName: 'table-of-contents__link--active',
    maxHeadingLevel,
    minHeadingLevel,
  });

  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar')}>
      <TOCHeadings
        toc={toc}
        minHeadingLevel={minHeadingLevel}
        maxHeadingLevel={maxHeadingLevel}
      />
    </div>
  );
}

export default TOC;
