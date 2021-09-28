/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {TOCItemsProps} from '@theme/TOCItems';
import {TOCItem} from '@docusaurus/types';
import {useThemeConfig, useTOCFilter} from '@docusaurus/theme-common';

// Recursive component rendering the toc tree
/* eslint-disable jsx-a11y/control-has-associated-label */
function TOCItemList({
  toc,
  className = 'table-of-contents table-of-contents__left-border',
  linkClassName = 'table-of-contents__link',
  isChild,
}: {
  readonly toc: readonly TOCItem[];
  readonly className?: string;
  readonly linkClassName?: string;
  readonly isChild?: boolean;
}): JSX.Element | null {
  if (!toc.length) {
    return null;
  }
  return (
    <ul className={isChild ? '' : className}>
      {toc.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            className={linkClassName}
            // Developer provided the HTML, so assume it's safe.
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{__html: heading.value}}
          />
          <TOCItemList
            isChild
            toc={heading.children}
            className={className}
            linkClassName={linkClassName}
          />
        </li>
      ))}
    </ul>
  );
}

export default function TOCItems({
  toc,
  minHeadingLevel: minHeadingLevelOption,
  maxHeadingLevel: maxHeadingLevelOption,
  ...props
}: TOCItemsProps): JSX.Element | null {
  const themeConfig = useThemeConfig();

  const minHeadingLevel =
    minHeadingLevelOption ?? themeConfig.tableOfContents.minHeadingLevel;
  const maxHeadingLevel =
    maxHeadingLevelOption ?? themeConfig.tableOfContents.maxHeadingLevel;

  const tocFiltered = useTOCFilter({toc, minHeadingLevel, maxHeadingLevel});

  return <TOCItemList toc={tocFiltered} {...props} />;
}
