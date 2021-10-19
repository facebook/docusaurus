/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import type {TOCProps} from '@theme/TOC';
import styles from './styles.module.css';
import {TOCItem} from '@docusaurus/types';

const LINK_CLASS_NAME = styles['table-of-contents__link--inline'];

/* eslint-disable jsx-a11y/control-has-associated-label */
function HeadingsInline({
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
            className={LINK_CLASS_NAME}
            // Developer provided the HTML, so assume it's safe.
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{__html: heading.value}}
          />
          <HeadingsInline isChild toc={heading.children} />
        </li>
      ))}
    </ul>
  );
}

function TOCInline({toc}: TOCProps): JSX.Element {
  return (
    <div className={clsx(styles.tableOfContentsInline)}>
      <HeadingsInline toc={toc} />
    </div>
  );
}

export default TOCInline;
