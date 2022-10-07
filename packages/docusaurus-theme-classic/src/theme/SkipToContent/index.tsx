/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import {useSkipToContent} from '@docusaurus/theme-common/internal';

import styles from './styles.module.css';

export default function SkipToContent(): JSX.Element {
  const {containerRef, handleSkip} = useSkipToContent();
  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={translate({id: 'theme.common.skipToMainContent'})}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" className={styles.skipToContent} onClick={handleSkip}>
        <Translate
          id="theme.common.skipToMainContent"
          description="The skip to content label used for accessibility, allowing to rapidly navigate to main content with keyboard tab/enter navigation">
          Skip to main content
        </Translate>
      </a>
    </div>
  );
}
