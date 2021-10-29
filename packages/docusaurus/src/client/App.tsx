/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import routes from '@generated/routes';
import renderRoutes from './exports/renderRoutes';
import {BrowserContextProvider} from './exports/browserContext';
import {DocusaurusContextProvider} from './exports/docusaurusContext';
import ErrorBoundary from './ErrorBoundary';
import PendingNavigation from './PendingNavigation';
import BaseUrlIssueBanner from './baseUrlIssueBanner/BaseUrlIssueBanner';
import Root from '@theme/Root';
import useIsBrowser from '@docusaurus/useIsBrowser';

import './client-lifecycles-dispatcher';

function App(): JSX.Element {
  const isBrowser = useIsBrowser();

  return (
    <ErrorBoundary logError={isBrowser} showError={isBrowser}>
      <DocusaurusContextProvider>
        <BrowserContextProvider>
          <Root>
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

export default App;
