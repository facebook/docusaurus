/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useLocation} from './exports/router';
import routes from '@generated/routes';
import renderRoutes from './exports/renderRoutes';
import {BrowserContextProvider} from './browserContext';
import {DocusaurusContextProvider} from './docusaurusContext';
import PendingNavigation from './PendingNavigation';
import BaseUrlIssueBanner from './BaseUrlIssueBanner';
import SiteMetadataDefaults from './SiteMetadataDefaults';
import Root from '@theme/Root';
import SiteMetadata from '@theme/SiteMetadata';
import RouteAnnouncer from './RouteAnnouncer';

import './clientLifecyclesDispatcher';

// TODO, quick fix for CSS insertion order
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import Error from '@theme/Error';

export default function App(): JSX.Element {
  const {pathname} = useLocation();
  return (
    <ErrorBoundary fallback={Error}>
      <DocusaurusContextProvider>
        <BrowserContextProvider>
          <Root>
            <SiteMetadataDefaults />
            <SiteMetadata />
            <BaseUrlIssueBanner />
            <PendingNavigation routes={routes} delay={1000}>
              <RouteAnnouncer location={pathname}>
                {renderRoutes(routes)}
              </RouteAnnouncer>
            </PendingNavigation>
          </Root>
        </BrowserContextProvider>
      </DocusaurusContextProvider>
    </ErrorBoundary>
  );
}
