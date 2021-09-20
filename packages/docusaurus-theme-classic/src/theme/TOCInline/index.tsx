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
  maxHeadingLevel,
}: {
  toc: readonly TOCItem[];
  isChild?: boolean;
  maxHeadingLevel: number;
}) {
  if (!toc.length) {
    return null;
  }

  const prunedTOC = toc.map((heading) => {
    if (heading.level <= maxHeadingLevel) {
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
          />
        </li>
      );
    } else {
      return null;
    }
  });

  return <ul className={isChild ? '' : 'table-of-contents'}>{prunedTOC}</ul>;
}

function TOCInline({toc, maxHeadingLevel}: TOCInlineProps): JSX.Element {
  const {tableOfContents} = useThemeConfig();
  return (
    <div className={clsx(styles.tableOfContentsInline)}>
      <HeadingsInline
        toc={toc}
        maxHeadingLevel={
          maxHeadingLevel ?? tableOfContents.maxHeadingLevel ?? 6
        }
      />
    </div>
  );
}

export default TOCInline;
