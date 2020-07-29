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
import {matchPath} from '@docusaurus/router';

import styles from './styles.module.css';

function DocPageContent({
  currentDocRoute,
  docsMetadata,
  children,
}): JSX.Element {
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
          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
        </main>
      </div>
    </Layout>
  );
}

function DocPage(props) {
  const {
    route: {routes: docRoutes},
    docsMetadata,
    location,
  } = props;
  const currentDocRoute = docRoutes.find((docRoute) =>
    matchPath(location.pathname, docRoute),
  );
  if (!currentDocRoute) {
    return <NotFound {...props} />;
  }
  return (
    <DocPageContent
      currentDocRoute={currentDocRoute}
      docsMetadata={docsMetadata}>
      {renderRoutes(docRoutes)}
    </DocPageContent>
  );
}

export default DocPage;
