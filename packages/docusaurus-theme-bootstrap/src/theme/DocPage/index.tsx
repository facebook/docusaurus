/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode} from 'react';
import renderRoutes from '@docusaurus/renderRoutes';
import NotFound from '@theme/NotFound';
import MDXComponents from '@theme/MDXComponents';
import Layout from '@theme/Layout';
import {MDXProvider} from '@mdx-js/react';
import {matchPath} from '@docusaurus/router';
import type {Props} from '@theme/DocPage';
import type {PropVersionMetadata} from '@docusaurus/plugin-content-docs-types';

type DocPageContentProps = {
  readonly versionMetadata: PropVersionMetadata;
  readonly children: ReactNode;
};

function DocPageContent({
  versionMetadata: _versionMetadata,
  children,
}: DocPageContentProps): JSX.Element {
  return (
    <Layout title="Doc page" description="My Doc page">
      <div className="d-flex vh-100">
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
    <DocPageContent versionMetadata={versionMetadata}>
      {renderRoutes(docRoutes)}
    </DocPageContent>
  );
}

export default DocPage;
