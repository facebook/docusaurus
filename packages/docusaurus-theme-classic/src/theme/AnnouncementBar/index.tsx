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
import IconClose from '@theme/IconClose';

import styles from './styles.module.css';

function AnnouncementBar(): JSX.Element | null {
  const {isActive, close} = useAnnouncementBar();
  const {announcementBar} = useThemeConfig();

  if (!isActive) {
    return null;
  }

  const {content, backgroundColor, textColor, isCloseable} = announcementBar!;

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
          <IconClose width={14} height={14} strokeWidth={3.1} />
        </button>
      ) : null}
    </div>
  );
}

export default AnnouncementBar;
