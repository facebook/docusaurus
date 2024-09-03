/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames, HtmlClassNameProvider} from '@docusaurus/theme-common';
import renderRoutes from '@docusaurus/renderRoutes';
import Layout from '@theme/Layout';

import type {Props} from '@theme/DocVersionRoot';

export default function DocsRoot(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.docsPages)}>
      <Layout>{renderRoutes(props.route.routes!)}</Layout>
    </HtmlClassNameProvider>
  );
}
