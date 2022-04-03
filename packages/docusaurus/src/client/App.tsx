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
import BaseUrlIssueBanner from './BaseUrlIssueBanner';
import SiteMetadataDefaults from './SiteMetadataDefaults';
import Root from '@theme/Root';
import SiteMetadata from '@theme/SiteMetadata';
import RouteAnnouncerWrapper from './RouteAnnouncerWrapper';
import {useLocation} from 'react-router';

import './clientLifecyclesDispatcher';

// TODO, quick fix for CSS insertion order
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import Error from '@theme/Error';

/* eslint-disable @typescript-eslint/ban-ts-comment */

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
              {/*
            // @ts-ignore */}
              <RouteAnnouncerWrapper location={pathname}>
                {renderRoutes(routes)}
              </RouteAnnouncerWrapper>
            </PendingNavigation>
          </Root>
        </BrowserContextProvider>
      </DocusaurusContextProvider>
    </ErrorBoundary>
  );
}
