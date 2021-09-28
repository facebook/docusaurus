/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import type {TOCProps} from '@theme/TOC';
import TOCItems from '@theme/TOCItems';
import styles from './styles.module.css';
import {useTOCHighlight} from '@docusaurus/theme-common';

const LINK_CLASS_NAME = 'table-of-contents__link';

function TOC({className, ...props}: TOCProps): JSX.Element {
  // TODO not good place !
  useTOCHighlight({
    linkClassName: LINK_CLASS_NAME,
    linkActiveClassName: 'table-of-contents__link--active',

    // TODO temporary hardcoded values
    minHeadingLevel: props.minHeadingLevel ?? 2,
    maxHeadingLevel: props.maxHeadingLevel ?? 3,
  });

  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar', className)}>
      <TOCItems {...props} />
    </div>
  );
}

export default TOC;
