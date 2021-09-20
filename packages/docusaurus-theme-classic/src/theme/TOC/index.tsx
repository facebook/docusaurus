/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import useTOCHighlight from '@theme/hooks/useTOCHighlight';
import type {TOCProps, TOCHeadingsProps} from '@theme/TOC';
import styles from './styles.module.css';

const LINK_CLASS_NAME = 'table-of-contents__link';

/* eslint-disable jsx-a11y/control-has-associated-label */
export function TOCHeadings({
  toc,
  isChild,
  maxHeadingLevel,
  minHeadingLevel,
  isInnerList,
}: TOCHeadingsProps): JSX.Element | null {
  // if no headings or every heading is too deep, return nothing
  if (!toc.length || toc.every((heading) => heading.level > maxHeadingLevel)) {
    return null;
  }

  const prunedTOC = toc.map((heading) => {
    // return a normal list item if we're between the min and max heading level
    if (heading.level >= minHeadingLevel && heading.level <= maxHeadingLevel) {
      return (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            className={LINK_CLASS_NAME}
            // Developer provided the HTML, so assume it's safe.
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{__html: heading.value}}
          />
          <TOCHeadings
            isChild
            toc={heading.children}
            maxHeadingLevel={maxHeadingLevel}
            minHeadingLevel={minHeadingLevel}
          />
        </li>
      );
      // if we're not at the min level yet AND we have children at future levels, don't
      // wrap the recursive `TOCHeadings` component with another <ul>
    } else if (heading.level < minHeadingLevel && heading.children) {
      return (
        <TOCHeadings
          isChild
          isInnerList
          toc={heading.children}
          maxHeadingLevel={maxHeadingLevel}
          minHeadingLevel={minHeadingLevel}
        />
      );
    } else {
      return null;
    }
  });

  if (isInnerList) {
    return <>{prunedTOC}</>;
  } else {
    return (
      <ul
        className={
          isChild ? '' : 'table-of-contents table-of-contents__left-border'
        }>
        {prunedTOC}
      </ul>
    );
  }
}

function TOC({toc, maxHeadingLevel, minHeadingLevel}: TOCProps): JSX.Element {
  const minLevel = minHeadingLevel ?? 2;
  useTOCHighlight({
    linkClassName: LINK_CLASS_NAME,
    linkActiveClassName: 'table-of-contents__link--active',
    maxHeadingLevel,
    minHeadingLevel: minLevel,
  });
  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar')}>
      <TOCHeadings
        toc={toc}
        maxHeadingLevel={maxHeadingLevel}
        minHeadingLevel={minLevel}
      />
    </div>
  );
}

export default TOC;
