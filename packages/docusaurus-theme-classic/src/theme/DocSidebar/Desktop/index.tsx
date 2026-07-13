/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useScrollPosition} from '@docusaurus/theme-common/internal';
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
  const [isNavbarVisible, setIsNavbarVisible] = useState(hideOnScroll);

  useScrollPosition(
    ({scrollY}) => {
      if (hideOnScroll) {
        setIsNavbarVisible(scrollY === 0);
      }
    },
    [hideOnScroll],
  );

  return (
    <nav
      aria-label={translate({
        id: 'theme.docs.sidebar.navAriaLabel',
        message: 'Docs sidebar',
        description: 'The ARIA label for the sidebar navigation',
      })}
      className={clsx(
        styles.sidebar,
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarHidden,
      )}>
      {hideOnScroll && (
        <Logo
          tabIndex={-1}
          className={styles.sidebarLogo}
          aria-hidden={isNavbarVisible || undefined}
          aria-label={
            isNavbarVisible
              ? undefined
              : translate({
                  id: 'theme.docs.sidebar.logoHomeAriaLabel',
                  message: 'Home page',
                  description:
                    'The ARIA label for the sidebar logo home link',
                })
          }
        />
      )}
      <Content path={path} sidebar={sidebar} />
      {hideable && <CollapseButton onClick={onCollapse} />}
    </nav>
  );
}

export default React.memo(DocSidebarDesktop);
