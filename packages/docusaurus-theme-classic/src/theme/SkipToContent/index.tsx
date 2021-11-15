/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useRef} from 'react';
import {useHistory} from '@docusaurus/router';
import Translate from '@docusaurus/Translate';
import {useLocationChange} from '@docusaurus/theme-common';

import styles from './styles.module.css';

function programmaticFocus(el: HTMLElement) {
  el.setAttribute('tabindex', '-1');
  el.focus();
  el.removeAttribute('tabindex');
}

function SkipToContent(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const {action} = useHistory();
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const targetElement: HTMLElement | null =
      document.querySelector('main:first-of-type') ||
      document.querySelector('.main-wrapper');

    if (targetElement) {
      programmaticFocus(targetElement);
    }
  };

  useLocationChange(({location}) => {
    if (containerRef.current && !location.hash && action === 'PUSH') {
      programmaticFocus(containerRef.current);
    }
  });

  return (
    <div ref={containerRef}>
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

export default SkipToContent;
