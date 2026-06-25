/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import '@generated/client-modules';
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from 'react-router';
import routes from '@generated/routes';
import siteConfig from '@generated/docusaurus.config';

import Root from '@theme/Root';
import ThemeProvider from '@theme/ThemeProvider';
import SiteMetadata from '@theme/SiteMetadata';
import {BrowserContextProvider} from './browserContext';
import {DocusaurusContextProvider} from './docusaurusContext';
import BaseUrlIssueBanner from './BaseUrlIssueBanner';
import SiteMetadataDefaults from './SiteMetadataDefaults';

// TODO, quick fix for CSS insertion order
// eslint-disable-next-line import/order
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import HasHydratedDataAttribute from './hasHydratedDataAttribute';

const createRouter =
  siteConfig.future.experimental_router === 'hash'
    ? createHashRouter
    : createBrowserRouter;

const router = createRouter(routes);

function AppNavigation() {
  return <RouterProvider router={router} />;
}

/*
function AppNavigation() {
  const location = useLocation();
  const normalizedLocation = normalizeLocation(location);
  return (
    <PendingNavigation location={normalizedLocation}>
      {routesElement}
    </PendingNavigation>
  );
}

 */

export default function App(): ReactNode {
  return (
    <ErrorBoundary>
      <DocusaurusContextProvider>
        <BrowserContextProvider>
          <Root>
            <ThemeProvider>
              <SiteMetadataDefaults />
              <SiteMetadata />
              <BaseUrlIssueBanner />
              <AppNavigation />
            </ThemeProvider>
          </Root>
          <HasHydratedDataAttribute />
        </BrowserContextProvider>
      </DocusaurusContextProvider>
    </ErrorBoundary>
  );
}
