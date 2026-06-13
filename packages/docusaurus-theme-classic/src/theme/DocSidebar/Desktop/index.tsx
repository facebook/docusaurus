/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useHideableNavbar} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import type {Props} from '@theme/DocSidebar/Desktop';

import styles from './styles.module.css';

function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}: Props) {
  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
  } = useThemeConfig();

  const {isNavbarVisible} = useHideableNavbar(hideOnScroll);

  return (
    <div
      className={clsx(
        styles.sidebar,
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarHidden,
      )}>
      {hideOnScroll && (
        <Logo
          tabIndex={-1}
          className={styles.sidebarLogo}
          aria-hidden={isNavbarVisible}
          aria-label={
            !isNavbarVisible
              ? translate({
                  id: 'theme.docs.sidebar.logo.ariaLabel',
                  message: 'Home page',
                  description:
                    'The ARIA label for the sidebar logo link when the navbar is hidden',
                })
              : undefined
          }
        />
      )}
      <Content path={path} sidebar={sidebar} />
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
