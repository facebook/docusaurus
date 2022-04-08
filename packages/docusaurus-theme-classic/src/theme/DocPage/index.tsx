/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import renderRoutes from '@docusaurus/renderRoutes';
import type {PropSidebar} from '@docusaurus/plugin-content-docs';
import NotFound from '@theme/NotFound';
import type {Props} from '@theme/DocPage';
import DocPageLayout from '@theme/DocPage/Layout';
import {matchPath} from '@docusaurus/router';

import clsx from 'clsx';

import {
  HtmlClassNameProvider,
  ThemeClassNames,
  docVersionSearchTag,
  DocsSidebarProvider,
  DocsVersionProvider,
} from '@docusaurus/theme-common';
import SearchMetadata from '@theme/SearchMetadata';

function extractDocRouteMetadata(props: Props): null | {
  docElement: JSX.Element;
  sidebarName: string | undefined;
  sidebarItems: PropSidebar | undefined;
} {
  const {
    route: {routes: docRoutes},
    versionMetadata,
    location,
  } = props;
  const currentDocRoute = docRoutes.find((docRoute) =>
    matchPath(location.pathname, docRoute),
  );
  if (!currentDocRoute) {
    return null;
  }

  // For now, the sidebarName is added as route config: not ideal!
  const sidebarName = currentDocRoute.sidebar;

  const sidebarItems = sidebarName
    ? versionMetadata.docsSidebars[sidebarName]
    : undefined;

  const docElement = renderRoutes(props.route.routes, {
    versionMetadata,
  });

  return {
    docElement,
    sidebarName,
    sidebarItems,
  };
}

export default function DocPage(props: Props): JSX.Element {
  const {versionMetadata} = props;
  const currentDocRouteMetadata = extractDocRouteMetadata(props);
  if (!currentDocRouteMetadata) {
    return <NotFound />;
  }
  const {docElement, sidebarName, sidebarItems} = currentDocRouteMetadata;
  return (
    <>
      <SearchMetadata
        version={versionMetadata.version}
        tag={docVersionSearchTag(
          versionMetadata.pluginId,
          versionMetadata.version,
        )}
      />
      <HtmlClassNameProvider
        className={clsx(
          // TODO: it should be removed from here
          ThemeClassNames.wrapper.docsPages,
          ThemeClassNames.page.docsDocPage,
          props.versionMetadata.className,
        )}>
        <DocsVersionProvider version={versionMetadata}>
          <DocsSidebarProvider name={sidebarName} items={sidebarItems}>
            <DocPageLayout>{docElement}</DocPageLayout>
          </DocsSidebarProvider>
        </DocsVersionProvider>
      </HtmlClassNameProvider>
    </>
  );
}
