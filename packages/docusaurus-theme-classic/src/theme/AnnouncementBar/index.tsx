/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {useThemeConfig, useAnnouncementBar} from '@docusaurus/theme-common';
import {translate} from '@docusaurus/Translate';

import styles from './styles.module.css';

function AnnouncementBar(): JSX.Element | null {
  const {isClosed, close} = useAnnouncementBar();
  const {announcementBar} = useThemeConfig();

  if (!announcementBar) {
    return null;
  }

  const {content, backgroundColor, textColor, isCloseable} = announcementBar;

  if (!content || (isCloseable && isClosed)) {
    return null;
  }

  return (
    <div
      className={styles.announcementBar}
      style={{backgroundColor, color: textColor}}
      role="banner">
      {isCloseable && <div className={styles.announcementBarPlaceholder} />}
      <div
        className={styles.announcementBarContent}
        // Developer provided the HTML, so assume it's safe.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: content}}
      />
      {isCloseable ? (
        <button
          type="button"
          className={clsx('clean-btn close', styles.announcementBarClose)}
          onClick={close}
          aria-label={translate({
            id: 'theme.AnnouncementBar.closeButtonAriaLabel',
            message: 'Close',
            description: 'The ARIA label for close button of announcement bar',
          })}>
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

export default AnnouncementBar;
