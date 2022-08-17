/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {
  ThemeClassNames,
  HtmlClassNameProvider,
  PageMetadata,
} from '@docusaurus/theme-common';
import {
  docVersionSearchTag,
  DocsVersionProvider,
} from '@docusaurus/theme-common/internal';
import renderRoutes from '@docusaurus/renderRoutes';
import SearchMetadata from '@theme/SearchMetadata';
import Layout from '@theme/Layout';

import type {Props} from '@theme/DocVersionPage';

function DocVersionPageMetadata(props: Props): JSX.Element {
  const {version} = props;
  return (
    <>
      <SearchMetadata
        version={version.version}
        tag={docVersionSearchTag(version.pluginId, version.version)}
      />
      <PageMetadata>
        {version.noIndex && <meta name="robots" content="noindex, nofollow" />}
      </PageMetadata>
    </>
  );
}

function DocVersionPageContent(props: Props): JSX.Element {
  const {version, route} = props;
  return (
    <Layout>
      <HtmlClassNameProvider
        className={clsx(ThemeClassNames.wrapper.docsPages, version.className)}>
        <DocsVersionProvider version={version}>
          {renderRoutes(route.routes!)}
        </DocsVersionProvider>
      </HtmlClassNameProvider>
    </Layout>
  );
}
export default function DocVersionPage(props: Props): JSX.Element {
  return (
    <>
      <DocVersionPageMetadata {...props} />
      <DocVersionPageContent {...props} />
    </>
  );
}
