/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useState, useCallback} from 'react';
import type {PropSidebar} from '@docusaurus/plugin-content-docs';
import Layout from '@theme/Layout';
import DocSidebar from '@theme/DocSidebar';
import IconArrow from '@theme/IconArrow';
import BackToTopButton from '@theme/BackToTopButton';
import {translate} from '@docusaurus/Translate';
import {useLocation} from '@docusaurus/router';
import type {Props} from '@theme/DocPage/Layout';

import clsx from 'clsx';
import styles from './styles.module.css';

import {ThemeClassNames, useDocsSidebar} from '@docusaurus/theme-common';

function SidebarExpandButton({toggleSidebar}: {toggleSidebar: () => void}) {
  return (
    <div
      className={styles.collapsedDocSidebar}
      title={translate({
        id: 'theme.docs.sidebar.expandButtonTitle',
        message: 'Expand sidebar',
        description:
          'The ARIA label and title attribute for expand button of doc sidebar',
      })}
      aria-label={translate({
        id: 'theme.docs.sidebar.expandButtonAriaLabel',
        message: 'Expand sidebar',
        description:
          'The ARIA label and title attribute for expand button of doc sidebar',
      })}
      tabIndex={0}
      role="button"
      onKeyDown={toggleSidebar}
      onClick={toggleSidebar}>
      <IconArrow className={styles.expandSidebarButtonIcon} />
    </div>
  );
}

type DocPageAsideProps = {
  sidebar: PropSidebar;
  hiddenSidebarContainer: boolean;
  setHiddenSidebarContainer: React.Dispatch<React.SetStateAction<boolean>>;
};

// Reset sidebar state when sidebar changes
// Use React key to unmount/remount the children
// See https://github.com/facebook/docusaurus/issues/3414
function ResetOnSidebarChange({children}: {children: ReactNode}) {
  const sidebar = useDocsSidebar();
  return (
    <React.Fragment key={sidebar?.name ?? 'noSidebar'}>
      {children}
    </React.Fragment>
  );
}

function DocPageAside({
  sidebar,
  hiddenSidebarContainer,
  setHiddenSidebarContainer,
}: DocPageAsideProps): JSX.Element {
  const {pathname} = useLocation();

  const [hiddenSidebar, setHiddenSidebar] = useState(false);
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }
    setHiddenSidebarContainer((value) => !value);
  }, [setHiddenSidebarContainer, hiddenSidebar]);

  return (
    <aside
      className={clsx(
        ThemeClassNames.docs.docSidebarContainer,
        styles.docSidebarContainer,
        hiddenSidebarContainer && styles.docSidebarContainerHidden,
      )}
      onTransitionEnd={(e) => {
        if (!e.currentTarget.classList.contains(styles.docSidebarContainer!)) {
          return;
        }

        if (hiddenSidebarContainer) {
          setHiddenSidebar(true);
        }
      }}>
      <ResetOnSidebarChange>
        <DocSidebar
          sidebar={sidebar}
          path={pathname}
          onCollapse={toggleSidebar}
          isHidden={hiddenSidebar}
        />
      </ResetOnSidebarChange>

      {hiddenSidebar && <SidebarExpandButton toggleSidebar={toggleSidebar} />}
    </aside>
  );
}

type DocPageMainProps = {
  hiddenSidebarContainer: boolean;
  children: ReactNode;
};

function DocPageMain({hiddenSidebarContainer, children}: DocPageMainProps) {
  const sidebar = useDocsSidebar();
  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced,
      )}>
      <div
        className={clsx(
          'container padding-top--md padding-bottom--lg',
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced,
        )}>
        {children}
      </div>
    </main>
  );
}

export default function DocPageLayout({children}: Props): JSX.Element {
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  return (
    <Layout>
      <BackToTopButton />
      <div className={styles.docPage}>
        {sidebar && (
          <DocPageAside
            sidebar={sidebar.items}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
          />
        )}
        <DocPageMain hiddenSidebarContainer={hiddenSidebarContainer}>
          {children}
        </DocPageMain>
      </div>
    </Layout>
  );
}
