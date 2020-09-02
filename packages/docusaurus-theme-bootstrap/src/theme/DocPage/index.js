/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import renderRoutes from '@docusaurus/renderRoutes';
import NotFound from '@theme/NotFound';
import DocSidebar from '@theme/DocSidebar';
import MDXComponents from '@theme/MDXComponents';
import Layout from '@theme/Layout';
import {MDXProvider} from '@mdx-js/react';
import {matchPath} from '@docusaurus/router';

function DocPageContent({currentDocRoute, versionMetadata, children}) {
  const {permalinkToSidebar, docsSidebars} = versionMetadata;
  const sidebarName = permalinkToSidebar[currentDocRoute.path];
  const sidebar = docsSidebars[sidebarName];
  return (
    <Layout title="Doc page" description="My Doc page">
      <div className="d-flex vh-100 overflow-hidden">
        {sidebar && (
          <div className="vh-100" role="complementary">
            <DocSidebar path={currentDocRoute.path} sidebar={sidebar} />
          </div>
        )}
        <main className="vh-100 w-100 d-flex flex-column align-items-center overflow-auto p-5">
          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
        </main>
      </div>
    </Layout>
  );
}

function DocPage(props) {
  const {
    route: {routes: docRoutes},
    versionMetadata,
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
      versionMetadata={versionMetadata}>
      {renderRoutes(docRoutes)}
    </DocPageContent>
  );
}

export default DocPage;
