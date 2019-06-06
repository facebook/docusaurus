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
import DocSidebar from '@theme/DocSidebar';
import MDXComponents from '@theme/MDXComponents';

function DocPage(props) {
  const {route, docsMetadata, location} = props;
  const {permalinkToId} = docsMetadata;
  const id =
    permalinkToId[location.pathname] ||
    permalinkToId[location.pathname.replace(/\/$/, '')];
  const metadata = docsMetadata.docs[id] || {};
  const {sidebar, description} = metadata;

  return (
    <Layout noFooter description={description}>
      <div className="container container--fluid">
        <div className="row">
          <div className="col col--3">
            <DocSidebar docsMetadata={docsMetadata} sidebar={sidebar} />
          </div>
          <main className="col">
            <MDXProvider components={MDXComponents}>
              {renderRoutes(route.routes, {docsMetadata})}
            </MDXProvider>
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default DocPage;
