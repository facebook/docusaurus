/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode} from 'react';
import renderRoutes from '@docusaurus/renderRoutes';
import NotFound from '@theme/NotFound';
import DocSidebar from '@theme/DocSidebar';
import MDXComponents from '@theme/MDXComponents';
import Layout from '@theme/Layout';
import {MDXProvider} from '@mdx-js/react';
import {matchPath} from '@docusaurus/router';
import type {Props} from '@theme/DocPage';
import type {DocumentRoute} from '@theme/DocItem';
import type {PropVersionMetadata} from '@docusaurus/plugin-content-docs-types';

type DocPageContentProps = {
  readonly currentDocRoute: DocumentRoute;
  readonly versionMetadata: PropVersionMetadata;
  readonly children: ReactNode;
};

function DocPageContent({
  currentDocRoute,
  versionMetadata,
  children,
}: DocPageContentProps): JSX.Element {
  const {permalinkToSidebar, docsSidebars} = versionMetadata;
  const sidebarName = permalinkToSidebar[currentDocRoute.path];
  const sidebar = docsSidebars[sidebarName];
  return (
    <Layout title="Doc page" description="My Doc page">
      <div className="d-flex vh-100">
        {sidebar && (
          <div role="complementary">
            <DocSidebar key={sidebarName} sidebar={sidebar} />
          </div>
        )}
        <main className="w-100 align-items-center overflow-auto p-5">
          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
        </main>
      </div>
    </Layout>
  );
}

function DocPage(props: Props): JSX.Element {
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
