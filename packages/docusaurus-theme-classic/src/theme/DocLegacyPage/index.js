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
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function DocLegacyPage(props) {
  const {route, docsMetadata, location} = props;
  const {permalinkToId} = docsMetadata;
  const id =
    permalinkToId[location.pathname] ||
    permalinkToId[location.pathname.replace(/\/$/, '')];
  const metadata = docsMetadata.docs[id] || {};
  const {sidebar, description, title, permalink, cover} = metadata;
  const {
    siteConfig: {url},
  } = useDocusaurusContext();
  return (
    <Layout
      noFooter
      description={description}
      title={title}
      image={cover}
      permalink={`${url}${permalink}`}>
      <div className="container container--fluid">
        <div className="row">
          <div className="col col--3">
            <DocLegacySidebar docsMetadata={docsMetadata} sidebar={sidebar} />
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

export default DocLegacyPage;
