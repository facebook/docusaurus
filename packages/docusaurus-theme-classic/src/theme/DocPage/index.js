/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {MDXProvider} from '@mdx-js/react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import renderRoutes from '@docusaurus/renderRoutes';
import Layout from '@theme/Layout';
import DocSidebar from '@theme/DocSidebar';
import MDXComponents from '@theme/MDXComponents';
import NotFound from '@theme/NotFound';
import {DocContextProvider, useDocContext} from '@theme/DocContext';
import {matchPath} from '@docusaurus/router';

import styles from './styles.module.css';

// TODO temporary test
const DocsVersionDisplay = () => {
  const {docsMetadata} = useDocContext();
  return (
    <div className="alert alert--danger margin--md">
      Test display version={docsMetadata.version}
    </div>
  );
};

function DocPageContent({currentDocRoute, docsMetadata, children}) {
  const {siteConfig, isClient} = useDocusaurusContext();
  const {permalinkToSidebar, docsSidebars, version} = docsMetadata;
  const sidebarName = permalinkToSidebar[currentDocRoute.path];
  const sidebar = docsSidebars[sidebarName];
  return (
    <Layout version={version} key={isClient}>
      <div className={styles.docPage}>
        {sidebar && (
          <div className={styles.docSidebarContainer} role="complementary">
            <DocSidebar
              sidebar={sidebar}
              path={currentDocRoute.path}
              sidebarCollapsible={
                siteConfig.themeConfig?.sidebarCollapsible ?? true
              }
            />
          </div>
        )}
        <main className={styles.docMainContainer}>
          <DocsVersionDisplay />

          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
        </main>
      </div>
    </Layout>
  );
}

function DocPage(props) {
  const {
    route: {routes: subroutes},
    docsMetadata,
    location,
  } = props;
  const currentDocRoute = subroutes.find((subroute) =>
    matchPath(location.pathname, subroute),
  );
  if (!currentDocRoute) {
    return <NotFound {...props} />;
  }
  return (
    <DocContextProvider
      currentDocRoute={currentDocRoute}
      docsMetadata={docsMetadata}>
      <DocPageContent
        currentDocRoute={currentDocRoute}
        docsMetadata={docsMetadata}>
        {renderRoutes(subroutes)}
      </DocPageContent>
    </DocContextProvider>
  );
}

export default DocPage;
