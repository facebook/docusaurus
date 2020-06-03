/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useCallback} from 'react';
import {MDXProvider} from '@mdx-js/react';
import classnames from 'classnames';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import renderRoutes from '@docusaurus/renderRoutes';
import Layout from '@theme/Layout';
import DocItem from '@theme/DocItem';
import DocSidebar from '@theme/DocSidebar';
import MDXComponents from '@theme/MDXComponents';
import NotFound from '@theme/NotFound';
import {matchPath} from '@docusaurus/router';

import styles from './styles.module.css';

function DocPage(props) {
  const {route: baseRoute, docsMetadata, location, content} = props;
  const {
    permalinkToSidebar,
    docsSidebars,
    version,
    isHomePage,
    homePagePath,
  } = docsMetadata;

  // Get case-sensitive route such as it is defined in the sidebar.
  const currentRoute = !isHomePage
    ? baseRoute.routes.find((route) => {
        return matchPath(location.pathname, route);
      }) || {}
    : {};

  const sidebar = isHomePage
    ? content.metadata.sidebar
    : permalinkToSidebar[currentRoute.path];
  const {
    siteConfig: {themeConfig: {sidebarCollapsible = true} = {}} = {},
    isClient,
  } = useDocusaurusContext();

  const [hiddenSidebar, setHiddenSidebar] = useState(false);
  // This state (and timeout above) is necessary to prevent background blinking
  // (since click triggers hover effect) when collapsing sidebar.
  const [enabledSidebarEffects, setEnabledSidebarEffects] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (!hiddenSidebar) {
      setTimeout(() => {
        setEnabledSidebarEffects(true);
      }, 500);
    } else {
      setEnabledSidebarEffects(false);
    }

    setHiddenSidebar(!hiddenSidebar);
  });

  if (!isHomePage && Object.keys(currentRoute).length === 0) {
    return <NotFound {...props} />;
  }

  return (
    <Layout version={version} key={isClient}>
      <div className={styles.docPage}>
        {sidebar && (
          <div
            className={classnames(styles.docSidebarContainer, {
              [styles.docSidebarContainerHidden]: hiddenSidebar,
              [styles.docSidebarContainerEnabledEffects]: enabledSidebarEffects,
            })}
            role="complementary">
            <DocSidebar
              docsSidebars={docsSidebars}
              path={isHomePage ? homePagePath : currentRoute.path}
              sidebar={sidebar}
              sidebarCollapsible={sidebarCollapsible}
              onToggle={toggleSidebar}
              isHiddenSidebar={hiddenSidebar}
            />

            {hiddenSidebar && (
              <div
                className={styles.collapsedDocSidebar}
                aria-label="Expand sidebar"
                tabIndex="0"
                role="button"
                onKeyDown={toggleSidebar}
                onClick={toggleSidebar}
              />
            )}
          </div>
        )}
        <main className={styles.docMainContainer}>
          <div
            className={classnames(
              'container padding-vert--lg',
              styles.docItemWrapper,
              {
                [styles.docItemWrapperEnhanced]: hiddenSidebar,
              },
            )}>
            <MDXProvider components={MDXComponents}>
              {isHomePage ? (
                <DocItem content={content} />
              ) : (
                renderRoutes(baseRoute.routes)
              )}
            </MDXProvider>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default DocPage;
