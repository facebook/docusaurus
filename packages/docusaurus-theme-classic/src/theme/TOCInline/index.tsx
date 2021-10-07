/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {TOCInlineProps} from '@theme/TOCInline';
import styles from './styles.module.css';
import TOCItems from '@theme/TOCItems';

function TOCInline({
  toc,
  minHeadingLevel,
  maxHeadingLevel,
}: TOCInlineProps): JSX.Element {
  return (
    <div className={styles.tableOfContentsInline}>
      <TOCItems
        toc={toc}
        minHeadingLevel={minHeadingLevel}
        maxHeadingLevel={maxHeadingLevel}
        className="table-of-contents"
        linkClassName={null}
      />
    </div>
  );
}

export default TOCInline;
