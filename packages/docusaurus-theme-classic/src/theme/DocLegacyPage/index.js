/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {MDXProvider} from '@mdx-js/react';

import renderRoutes from '@docusaurus/renderRoutes';
import Layout from '@theme/Layout';
import DocLegacySidebar from '@theme/DocLegacySidebar';
import MDXComponents from '@theme/MDXComponents';

function DocLegacyPage(props) {
  const {route, docsMetadata, location} = props;
  const {permalinkToSidebar, docsSidebars} = docsMetadata;
  const sidebar =
    permalinkToSidebar[location.pathname] ||
    permalinkToSidebar[location.pathname.replace(/\/$/, '')];
  return (
    <Layout noFooter>
      <div className="container container--fluid">
        <div className="row">
          <div className="col col--3">
            <DocLegacySidebar
              docsSidebars={docsSidebars}
              location={location}
              sidebar={sidebar}
            />
          </div>
          <main className="col">
            <MDXProvider components={MDXComponents}>
              {renderRoutes(route.routes)}
            </MDXProvider>
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default DocLegacyPage;
