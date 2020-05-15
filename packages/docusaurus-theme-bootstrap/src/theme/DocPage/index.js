/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import renderRoutes from '@docusaurus/renderRoutes';
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

  return (
    <Layout title="Doc page" description="My Doc page">
      <DocSidebar
        docsSidebars={docsSidebars}
        path={currentRoute.path}
        sidebar={sidebar}
      />
      <section className="offset-1 mr-4 mt-4 col-xl-6 offset-xl-4 p-0 justify-content-center align-self-center ">
        <MDXProvider components={MDXComponents}>
          {renderRoutes(baseRoute.routes)}
        </MDXProvider>
      </section>
    </Layout>
  );
}

export default DocPage;
