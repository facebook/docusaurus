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
  recurseDepth,
}: {
  toc: readonly TOCItem[];
  isChild?: boolean;
  recurseDepth: number;
}) {
  if (!toc.length || recurseDepth < 1) {
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
          <HeadingsInline
            isChild
            toc={heading.children}
            recurseDepth={recurseDepth - 1}
          />
        </li>
      ))}
    </ul>
  );
}

function TOCInline({toc, maxHeadingLevel}: TOCInlineProps): JSX.Element {
  const {tableOfContents} = useThemeConfig();
  const recurseDepth = (maxHeadingLevel ?? tableOfContents.maxHeadingLevel) - 1;
  return (
    <div className={clsx(styles.tableOfContentsInline)}>
      <HeadingsInline toc={toc} recurseDepth={recurseDepth} />
    </div>
  );
}

export default TOCInline;
