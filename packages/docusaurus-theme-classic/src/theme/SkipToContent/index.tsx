/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {SkipToContentLink} from '@docusaurus/theme-common';
import styles from './styles.module.css';

export default function SkipToContent(): JSX.Element {
  return <SkipToContentLink className={styles.skipToContent} />;
}
