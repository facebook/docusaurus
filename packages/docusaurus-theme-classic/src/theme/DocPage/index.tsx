/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useState, useCallback} from 'react';
import renderRoutes from '@docusaurus/renderRoutes';
import type {PropSidebar} from '@docusaurus/plugin-content-docs';
import Layout from '@theme/Layout';
import DocSidebar from '@theme/DocSidebar';
import NotFound from '@theme/NotFound';
import type {DocumentRoute} from '@theme/DocItem';
import type {Props} from '@theme/DocPage';
import IconArrow from '@theme/IconArrow';
import BackToTopButton from '@theme/BackToTopButton';
import {matchPath} from '@docusaurus/router';
import {translate} from '@docusaurus/Translate';

import clsx from 'clsx';
import styles from './styles.module.css';

import {
  HtmlClassNameProvider,
  ThemeClassNames,
  docVersionSearchTag,
  DocsSidebarProvider,
  useDocsSidebar,
  DocsVersionProvider,
} from '@docusaurus/theme-common';
import SearchMetadata from '@theme/SearchMetadata';

type DocPageContentProps = {
  readonly currentDocRoute: DocumentRoute;
  readonly children: ReactNode;
  readonly sidebarName: string | undefined;
};

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

type DocPageAsideProps = Pick<
  DocPageContentProps,
  'currentDocRoute' | 'sidebarName'
> & {
  hiddenSidebarContainer: boolean;
  setHiddenSidebarContainer: React.Dispatch<React.SetStateAction<boolean>>;
  sidebar: PropSidebar;
};

function DocPageAside({
  hiddenSidebarContainer,
  setHiddenSidebarContainer,
  currentDocRoute,
  sidebarName,
  sidebar,
}: DocPageAsideProps): JSX.Element {
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
      <DocSidebar
        key={
          // Reset sidebar state on sidebar changes
          // See https://github.com/facebook/docusaurus/issues/3414
          sidebarName
        }
        sidebar={sidebar}
        path={currentDocRoute.path}
        onCollapse={toggleSidebar}
        isHidden={hiddenSidebar}
      />

      {hiddenSidebar && <SidebarExpandButton toggleSidebar={toggleSidebar} />}
    </aside>
  );
}

type DocPageMainProps = {
  sidebar: PropSidebar | null;
  hiddenSidebarContainer: boolean;
  children: ReactNode;
};

function DocPageMain({
  hiddenSidebarContainer,
  sidebar,
  children,
}: DocPageMainProps) {
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

function DocPageLayout({
  currentDocRoute,
  children,
  sidebarName,
}: DocPageContentProps): JSX.Element {
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  return (
    <Layout>
      <BackToTopButton />

      <div className={styles.docPage}>
        {sidebar && (
          <DocPageAside
            currentDocRoute={currentDocRoute}
            sidebarName={sidebarName}
            sidebar={sidebar}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
          />
        )}
        <DocPageMain
          sidebar={sidebar}
          hiddenSidebarContainer={hiddenSidebarContainer}>
          {children}
        </DocPageMain>
      </div>
    </Layout>
  );
}

function extractDocRouteMetadata(props: Props): null | {
  currentDocRoute: DocumentRoute;
  currentDocRouteElement: JSX.Element;
  sidebarName: string | undefined;
  sidebar: PropSidebar | undefined;
} {
  const {
    route: {routes: docRoutes},
    versionMetadata,
    location,
  } = props;
  const currentDocRoute = docRoutes.find((docRoute) =>
    matchPath(location.pathname, docRoute),
  );
  if (!currentDocRoute) {
    return null;
  }

  // For now, the sidebarName is added as route config: not ideal!
  const sidebarName = currentDocRoute.sidebar;

  const sidebar = sidebarName
    ? versionMetadata.docsSidebars[sidebarName]
    : undefined;

  const currentDocRouteElement = renderRoutes(props.route.routes, {
    versionMetadata,
  });

  return {
    currentDocRoute,
    currentDocRouteElement,
    sidebarName,
    sidebar,
  };
}

export default function DocPage(props: Props): JSX.Element {
  const {versionMetadata} = props;
  const currentDocRouteMetadata = extractDocRouteMetadata(props);
  if (!currentDocRouteMetadata) {
    return <NotFound />;
  }
  const {currentDocRoute, currentDocRouteElement, sidebar, sidebarName} =
    currentDocRouteMetadata;
  return (
    <>
      <SearchMetadata
        version={versionMetadata.version}
        tag={docVersionSearchTag(
          versionMetadata.pluginId,
          versionMetadata.version,
        )}
      />
      <HtmlClassNameProvider
        className={clsx(
          ThemeClassNames.wrapper.docsPages,
          ThemeClassNames.page.docsDocPage,
          props.versionMetadata.className,
        )}>
        <DocsVersionProvider version={versionMetadata}>
          <DocsSidebarProvider sidebar={sidebar ?? null}>
            <DocPageLayout
              currentDocRoute={currentDocRoute}
              sidebarName={sidebarName}>
              {currentDocRouteElement}
            </DocPageLayout>
          </DocsSidebarProvider>
        </DocsVersionProvider>
      </HtmlClassNameProvider>
    </>
  );
}
