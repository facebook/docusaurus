/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


import React from 'react';
import renderRoutes from '@docusaurus/renderRoutes';
import MDXComponents from '@theme/MDXComponents';
import {MDXProvider} from '@mdx-js/react';

function DocPage (props) {
  const {route: baseRoute, docsMetadata, location} = props;

  return (
    <main>
      <MDXProvider components={MDXComponents}>
        {renderRoutes(baseRoute.routes)}
      </MDXProvider>
    </main>
  )

}

export default DocPage;
