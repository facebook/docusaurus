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
import {useThemeConfig, useTOCFilter} from '@docusaurus/theme-common';

/* eslint-disable jsx-a11y/control-has-associated-label */
function HeadingListInline({
  toc,
  isChild,
}: {
  toc: readonly TOCItem[];
  isChild?: boolean;
}) {
  if (!toc.length) {
    return null;
  }
  return (
    <ul className={isChild ? '' : 'table-of-contents'}>
      {toc.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            // Developer provided the HTML, so assume it's safe.
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{__html: heading.value}}
          />
          <HeadingListInline isChild toc={heading.children} />
        </li>
      ))}
    </ul>
  );
}

function HeadingsInline({
  toc,
  minHeadingLevel,
  maxHeadingLevel,
}: {
  toc: readonly TOCItem[];
  minHeadingLevel: number;
  maxHeadingLevel: number;
}) {
  const tocFiltered = useTOCFilter({toc, minHeadingLevel, maxHeadingLevel});
  return <HeadingListInline toc={tocFiltered} />;
}

function TOCInline({
  toc,
  minHeadingLevel,
  maxHeadingLevel,
}: TOCInlineProps): JSX.Element {
  const {tableOfContents} = useThemeConfig();
  return (
    <div className={clsx(styles.tableOfContentsInline)}>
      <HeadingsInline
        toc={toc}
        // TODO remove this
        minHeadingLevel={minHeadingLevel ?? 2}
        maxHeadingLevel={
          maxHeadingLevel ?? tableOfContents.maxHeadingLevel ?? 4
        }
      />
    </div>
  );
}

export default TOCInline;
