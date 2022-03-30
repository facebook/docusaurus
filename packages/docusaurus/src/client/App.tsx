/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import routes from '@generated/routes';
import renderRoutes from './exports/renderRoutes';
import {BrowserContextProvider} from './browserContext';
import {DocusaurusContextProvider} from './docusaurusContext';
import PendingNavigation from './PendingNavigation';
import BaseUrlIssueBanner from './baseUrlIssueBanner/BaseUrlIssueBanner';
import SiteMetadataDefaults from './SiteMetadataDefaults';
import Root from '@theme/Root';
import SiteMetadata from '@theme/SiteMetadata';

import './client-lifecycles-dispatcher';

// TODO, quick fix for CSS insertion order
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import Error from '@theme/Error';

export default function App(): JSX.Element {
  return (
    <ErrorBoundary fallback={Error}>
      <DocusaurusContextProvider>
        <BrowserContextProvider>
          <Root>
            <SiteMetadataDefaults />
            <SiteMetadata />
            <BaseUrlIssueBanner />
            <PendingNavigation routes={routes} delay={1000}>
              {renderRoutes(routes)}
            </PendingNavigation>
          </Root>
        </BrowserContextProvider>
      </DocusaurusContextProvider>
    </ErrorBoundary>
  );
}
