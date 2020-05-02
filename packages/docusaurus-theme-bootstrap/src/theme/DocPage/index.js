/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import renderRoutes from '@docusaurus/renderRoutes';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import DocSidebar from '@theme/DocSidebar';
import MDXComponents from '@theme/MDXComponents';
import Layout from '@theme/Layout';
import {MDXProvider} from '@mdx-js/react';
import {matchPath} from '@docusaurus/router';

function DocPage(props) {
  const {route: baseRoute, docsMetadata, location} = props;
  // case-sensitive route such as it is defined in the sidebar
  const currentRoute =
    baseRoute.routes.find((route) => {
      return matchPath(location.pathname, route);
    }) || {};
  const {permalinkToSidebar, docsSidebars} = docsMetadata;
  const sidebar = permalinkToSidebar[currentRoute.path];
  const {siteConfig: {themeConfig = {}} = {}} = useDocusaurusContext();
  const {sidebarCollapsible = true} = themeConfig;

  return (
    <Layout title="Blog page" description="My blog page">
      <DocSidebar
        docsSidebars={docsSidebars}
        path={currentRoute.path}
        sidebar={sidebar}
        sidebarCollapsible={sidebarCollapsible}
      />
      <div className="container mt-4">
        <section className="row justify-content-center">
          <MDXProvider components={MDXComponents}>
            {renderRoutes(baseRoute.routes)}
          </MDXProvider>
        </section>
      </div>
    </Layout>
  );
}

export default DocPage;
