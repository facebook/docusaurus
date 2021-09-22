/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import type {TOCInlineProps} from '@theme/TOCInline';
import styles from './styles.module.css';
import {TOCItem} from '@docusaurus/types';
import {useThemeConfig} from '@docusaurus/theme-common';

/* eslint-disable jsx-a11y/control-has-associated-label */
function HeadingsInline({
  toc,
  isChild,
  isInnerList,
  maxHeadingLevel,
  minHeadingLevel,
}: {
  toc: readonly TOCItem[];
  isChild?: boolean;
  isInnerList?: boolean;
  maxHeadingLevel: number;
  minHeadingLevel: number;
}) {
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
            // Developer provided the HTML, so assume it's safe.
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{__html: heading.value}}
          />
          <HeadingsInline
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
        <HeadingsInline
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

function TOCInline({
  toc,
  maxHeadingLevel,
  minHeadingLevel,
}: TOCInlineProps): JSX.Element {
  const {tableOfContents} = useThemeConfig();
  return (
    <div className={clsx(styles.tableOfContentsInline)}>
      <HeadingsInline
        toc={toc}
        maxHeadingLevel={
          maxHeadingLevel ?? tableOfContents.maxHeadingLevel ?? 4
        }
        minHeadingLevel={minHeadingLevel ?? 2}
      />
    </div>
  );
}

export default TOCInline;
