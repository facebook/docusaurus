/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import {
  useAnnouncementBar,
  useScrollPosition,
} from '@docusaurus/theme-common/internal';
import IconArrow from '@theme/Icon/Arrow';
import type {Props} from '@theme/DocSidebar/Desktop/CollapseButton';

import styles from './styles.module.css';

function useShowAnnouncementBar() {
  const {isActive} = useAnnouncementBar();
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive);

  useScrollPosition(
    ({scrollY}) => {
      if (isActive) {
        const newMarginBottom = `${30 - scrollY}px`;
        document.documentElement.style.setProperty(
          '--docusaurus-collapse-button-margin-bottom',
          newMarginBottom,
        );
        setShowAnnouncementBar(scrollY <= 30);
      }
    },
    [isActive],
  );
  return isActive && showAnnouncementBar;
}

export default function CollapseButton({onClick}: Props): JSX.Element {
  const showAnnouncementBar = useShowAnnouncementBar();
  return (
    <button
      type="button"
      title={translate({
        id: 'theme.docs.sidebar.collapseButtonTitle',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar',
      })}
      aria-label={translate({
        id: 'theme.docs.sidebar.collapseButtonAriaLabel',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar',
      })}
      className={clsx(
        'button button--secondary button--outline',
        styles.collapseSidebarButton,
        showAnnouncementBar && styles.menuWithAnnouncementBar,
      )}
      onClick={onClick}>
      <IconArrow className={styles.collapseSidebarButtonIcon} />
    </button>
  );
}
