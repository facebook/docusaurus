/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {HtmlClassNameProvider, PageMetadata} from '@docusaurus/theme-common';
import {
  getDocsVersionSearchTag,
  DocsVersionProvider,
} from '@docusaurus/plugin-content-docs/client';
import renderRoutes from '@docusaurus/renderRoutes';
import SearchMetadata from '@theme/SearchMetadata';

import type {Props} from '@theme/DocVersionRoot';

function DocVersionRootMetadata(props: Props): JSX.Element {
  const {version} = props;
  return (
    <>
      <SearchMetadata
        version={version.version}
        tag={getDocsVersionSearchTag(version.pluginId, version.version)}
      />
      <PageMetadata>
        {version.noIndex && <meta name="robots" content="noindex, nofollow" />}
      </PageMetadata>
    </>
  );
}

function DocVersionRootContent(props: Props): JSX.Element {
  const {version, route} = props;
  return (
    <HtmlClassNameProvider className={version.className}>
      <DocsVersionProvider version={version}>
        {renderRoutes(route.routes!)}
      </DocsVersionProvider>
    </HtmlClassNameProvider>
  );
}
export default function DocVersionRoot(props: Props): JSX.Element {
  return (
    <>
      <DocVersionRootMetadata {...props} />
      <DocVersionRootContent {...props} />
    </>
  );
}
